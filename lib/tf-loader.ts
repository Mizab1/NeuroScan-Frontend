import * as tf from '@tensorflow/tfjs';
import { MODEL_CONFIG } from './constants';
import { ModelStatusInfo, ModelBackend } from './types';

let cachedModel: tf.GraphModel | null = null;
let currentBackend: ModelBackend = 'unknown';

export async function initTensorFlowBackend(): Promise<ModelBackend> {
  try {
    if (typeof window === 'undefined') return 'unknown';

    // Try setting WebGL first for GPU hardware acceleration
    await tf.setBackend('webgl');
    await tf.ready();
    currentBackend = 'webgl';
    return 'webgl';
  } catch (webglErr) {
    console.warn('WebGL backend failed, falling back to CPU:', webglErr);
    try {
      await tf.setBackend('cpu');
      await tf.ready();
      currentBackend = 'cpu';
      return 'cpu';
    } catch (cpuErr) {
      console.error('Failed to initialize TF.js CPU backend:', cpuErr);
      currentBackend = 'unknown';
      return 'unknown';
    }
  }
}

export function getTfMemoryInfo(): { tensors: number; bytes: number } {
  try {
    const mem = tf.memory();
    return {
      tensors: mem.numTensors || 0,
      bytes: mem.numBytes || 0,
    };
  } catch {
    return { tensors: 0, bytes: 0 };
  }
}

export function getLoadedModel(): tf.GraphModel | null {
  return cachedModel;
}

export async function clearIndexedDBCache(): Promise<void> {
  try {
    await tf.io.removeModel(MODEL_CONFIG.INDEXED_DB_URI);
    cachedModel = null;
    console.log('Cleared IndexedDB cached model:', MODEL_CONFIG.INDEXED_DB_URI);
  } catch (err) {
    console.warn('No cached model found in IndexedDB to remove or error removing:', err);
  }
}

export async function loadNeuroScanModel(
  onStatusUpdate: (status: ModelStatusInfo) => void
): Promise<tf.GraphModel | null> {
  if (typeof window === 'undefined') return null;

  const startTime = performance.now();

  try {
    // 1. Initialize Backend
    onStatusUpdate({
      state: 'checking-cache',
      backend: currentBackend,
      progress: 5,
      isCachedInIndexedDB: false,
      ...getTfMemoryInfo(),
    });

    const backend = await initTensorFlowBackend();

    // 2. Check IndexedDB cache
    let isCached = false;
    try {
      const models = await tf.io.listModels();
      if (models[MODEL_CONFIG.INDEXED_DB_URI]) {
        isCached = true;
      }
    } catch (cacheCheckErr) {
      console.warn('Could not inspect IndexedDB models:', cacheCheckErr);
    }

    let model: tf.GraphModel | null = null;

    if (isCached) {
      // 3A. Load from IndexedDB using tf.loadGraphModel
      onStatusUpdate({
        state: 'compiling',
        backend,
        progress: 60,
        isCachedInIndexedDB: true,
        ...getTfMemoryInfo(),
      });

      try {
        model = await tf.loadGraphModel(MODEL_CONFIG.INDEXED_DB_URI);
      } catch (idbLoadErr) {
        console.warn('Corrupted IndexedDB model, purging and loading from URL:', idbLoadErr);
        await clearIndexedDBCache();
        isCached = false;
      }
    }

    if (!model) {
      // 3B. Download from public/tfjs_model/model.json using tf.loadGraphModel
      onStatusUpdate({
        state: 'downloading',
        backend,
        progress: 15,
        isCachedInIndexedDB: false,
        ...getTfMemoryInfo(),
      });

      // Verify that model.json exists via head/get request before passing to TF.js
      try {
        const checkRes = await fetch(MODEL_CONFIG.LOCAL_MODEL_PATH, { method: 'HEAD' });
        if (!checkRes.ok && checkRes.status === 404) {
          throw new Error('MODEL_NOT_FOUND');
        }
      } catch (fetchErr: unknown) {
        const errorMsg = fetchErr instanceof Error ? fetchErr.message : '';
        if (errorMsg === 'MODEL_NOT_FOUND') {
          onStatusUpdate({
            state: 'model-missing',
            backend,
            progress: 0,
            isCachedInIndexedDB: false,
            errorMessage: 'Model files not found in public/tfjs_model/. Please drop model.json & shards into public/tfjs_model/.',
            ...getTfMemoryInfo(),
          });
          return null;
        }
      }

      model = await tf.loadGraphModel(MODEL_CONFIG.LOCAL_MODEL_PATH, {
        onProgress: (fraction) => {
          const pct = Math.round(15 + fraction * 70);
          onStatusUpdate({
            state: 'downloading',
            backend,
            progress: Math.min(85, pct),
            isCachedInIndexedDB: false,
            ...getTfMemoryInfo(),
          });
        },
      });

      // 4. Save to IndexedDB for next reload
      try {
        await model.save(MODEL_CONFIG.INDEXED_DB_URI);
        isCached = true;
      } catch (saveErr) {
        console.warn('Could not save model to IndexedDB:', saveErr);
      }
    }

    // 5. Shader Warmup Run (dummy inference to compile WebGL shaders)
    onStatusUpdate({
      state: 'warming-up',
      backend,
      progress: 90,
      isCachedInIndexedDB: isCached,
      ...getTfMemoryInfo(),
    });

    // Execute warmup inside tf.tidy to avoid tensor leak
    tf.tidy(() => {
      const dummy = tf.zeros([1, MODEL_CONFIG.INPUT_WIDTH, MODEL_CONFIG.INPUT_HEIGHT, MODEL_CONFIG.INPUT_CHANNELS]);
      const warmupRes = model.predict(dummy);
      if (Array.isArray(warmupRes)) {
        warmupRes.forEach((t) => t.dataSync());
      } else if (warmupRes instanceof tf.Tensor) {
        warmupRes.dataSync();
      }
    });

    cachedModel = model;
    const duration = performance.now() - startTime;

    onStatusUpdate({
      state: 'ready',
      backend,
      progress: 100,
      isCachedInIndexedDB: isCached,
      loadDurationMs: duration,
      ...getTfMemoryInfo(),
    });

    return model;
  } catch (err: unknown) {
    console.error('Error in loadNeuroScanModel:', err);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const is404 =
      errorMessage.includes('404') ||
      errorMessage.includes('MODEL_NOT_FOUND') ||
      errorMessage.includes('Failed to fetch');

    onStatusUpdate({
      state: is404 ? 'model-missing' : 'error',
      backend: currentBackend,
      progress: 0,
      isCachedInIndexedDB: false,
      errorMessage: is404
        ? 'Model files not found in public/tfjs_model/. Please drop model.json and weight shards into public/tfjs_model/.'
        : `Model initialization failed: ${errorMessage}`,
      ...getTfMemoryInfo(),
    });

    return null;
  }
}
