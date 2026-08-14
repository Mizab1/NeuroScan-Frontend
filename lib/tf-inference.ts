import * as tf from '@tensorflow/tfjs';
import { TUMOR_CLASSES, CLASS_METADATA, MODEL_CONFIG } from './constants';
import { TumorClass, ClassProbability, InferenceResult } from './types';

/**
 * Executes pure client-side WebGL accelerated inference on an image element.
 * Wrapped 100% inside tf.tidy to guarantee zero tensor/memory leaks.
 */
export async function runModelInference(
  imageSource: HTMLImageElement | HTMLCanvasElement,
  model: tf.GraphModel | tf.LayersModel
): Promise<InferenceResult> {
  const startTime = performance.now();

  const rawProbabilities = tf.tidy(() => {
    // 1. Convert DOM image to 3D Tensor [height, width, 3] in RGB
    const rawTensor = tf.browser.fromPixels(imageSource, MODEL_CONFIG.INPUT_CHANNELS);

    // 2. Resize to exact input resolution: [256, 256]
    const resizedTensor = tf.image.resizeBilinear(rawTensor, [
      MODEL_CONFIG.INPUT_WIDTH,
      MODEL_CONFIG.INPUT_HEIGHT,
    ]);

    // 3. Normalize pixels from [0, 255] to [0.0, 1.0]
    const normalizedTensor = resizedTensor.toFloat().div(tf.scalar(MODEL_CONFIG.NORMALIZATION_FACTOR));

    // 4. Reshape to batch format: [1, 256, 256, 3]
    const batchedTensor = normalizedTensor.expandDims(0);

    // 5. Execute model forward pass (handles GraphModel and LayersModel return types)
    const output = model.predict(batchedTensor);
    const outputTensor = Array.isArray(output) ? output[0] : (output as tf.Tensor);

    // 6. Ensure probabilities sum to 1.0 (apply softmax if raw logits are returned)
    const probTensor =
      outputTensor.shape.length > 1 && outputTensor.shape[1] === 4
        ? tf.softmax(outputTensor)
        : outputTensor;

    // 7. Extract data to typed array
    const data = probTensor.dataSync();
    return Array.from(data);
  });

  const inferenceTimeMs = performance.now() - startTime;
  return formatInferenceOutput(rawProbabilities, inferenceTimeMs, false);
}

/**
 * High-fidelity fallback / simulated inference runner for development & UI testing
 * when model files have not yet been copied into public/tfjs_model/
 */
export function runSimulatedInference(
  presetCategory?: TumorClass
): InferenceResult {
  const startTime = performance.now();

  // Synthetic distribution reflecting the preset or high-contrast sample
  const targetCategory = presetCategory || 'No Tumor';
  const probs: number[] = [0.05, 0.05, 0.05, 0.05];

  const targetIdx = TUMOR_CLASSES.indexOf(targetCategory);
  if (targetIdx !== -1) {
    const dominantConfidence = 0.94 + Math.random() * 0.05; // 94% - 99%
    const remaining = (1 - dominantConfidence) / 3;
    for (let i = 0; i < 4; i++) {
      probs[i] = i === targetIdx ? dominantConfidence : remaining + (Math.random() * 0.01 - 0.005);
    }
  }

  // Normalize to 1.0
  const sum = probs.reduce((a, b) => a + b, 0);
  const normalizedProbs = probs.map((p) => p / sum);

  const inferenceTimeMs = 8.5 + Math.random() * 4.2; // simulate ~10ms WebGL pass
  return formatInferenceOutput(normalizedProbs, inferenceTimeMs, true);
}

function formatInferenceOutput(
  rawProbabilities: number[],
  inferenceTimeMs: number,
  isSimulated: boolean
): InferenceResult {
  let highestIdx = 0;
  let highestVal = -1;

  const probabilities: ClassProbability[] = TUMOR_CLASSES.map((className, index) => {
    const prob = Math.max(0, Math.min(1, rawProbabilities[index] || 0));
    if (prob > highestVal) {
      highestVal = prob;
      highestIdx = index;
    }

    const pct = prob * 100;
    const metadata = CLASS_METADATA[className];

    return {
      className,
      rawProbability: prob,
      percentage: pct,
      formattedPercent: `${pct.toFixed(2)}%`,
      isTopPrediction: false,
      riskTier: metadata.riskTier,
      description: metadata.description,
    };
  });

  // Mark winning class
  probabilities[highestIdx].isTopPrediction = true;
  const topClass = probabilities[highestIdx].className;
  const topConfidence = probabilities[highestIdx].rawProbability;

  return {
    topClass,
    topConfidence,
    topFormattedPercent: probabilities[highestIdx].formattedPercent,
    isHealthy: topClass === 'No Tumor',
    probabilities,
    inferenceTimeMs: Math.round(inferenceTimeMs * 100) / 100,
    timestamp: new Date(),
    inputResolution: '256 × 256 × 3 (RGB)',
    deviceBackend: isSimulated ? 'Simulation Pipeline' : tf.getBackend() || 'webgl',
    isSimulated,
  };
}
