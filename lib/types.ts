export type TumorClass = 'Glioma' | 'Meningioma' | 'No Tumor' | 'Pituitary';

export type ModelBackend = 'webgl' | 'webgpu' | 'cpu' | 'unknown';

export type ModelLoadState = 
  | 'idle'
  | 'checking-cache'
  | 'downloading'
  | 'compiling'
  | 'warming-up'
  | 'ready'
  | 'model-missing'
  | 'error';

export interface ModelStatusInfo {
  state: ModelLoadState;
  backend: ModelBackend;
  progress: number; // 0 to 100
  isCachedInIndexedDB: boolean;
  errorMessage?: string;
  loadDurationMs?: number;
  memoryTensors?: number;
  memoryBytes?: number;
  isSimulatedFallback?: boolean;
}

export interface ClassProbability {
  className: TumorClass;
  rawProbability: number;
  percentage: number;
  formattedPercent: string;
  isTopPrediction: boolean;
  riskTier: 'healthy' | 'caution' | 'critical';
  description: string;
}

export interface InferenceResult {
  topClass: TumorClass;
  topConfidence: number;
  topFormattedPercent: string;
  isHealthy: boolean;
  probabilities: ClassProbability[];
  inferenceTimeMs: number;
  timestamp: Date;
  inputResolution: string;
  deviceBackend: string;
  isSimulated?: boolean;
}

export interface SamplePreset {
  id: string;
  label: string;
  category: TumorClass;
  description: string;
  imageSrc: string;
  viewType: string;
}

export interface ImageAdjustments {
  brightness: number; // 50 to 150 (default 100)
  contrast: number;   // 50 to 150 (default 100)
  invert: boolean;
  colormap: 'grayscale' | 'contrast-enhanced' | 'thermal' | 'invert';
  zoom: number;       // 1.0 to 2.5
}
