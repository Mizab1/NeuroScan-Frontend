import { TumorClass, SamplePreset, ImageAdjustments } from './types';

export const TUMOR_CLASSES: TumorClass[] = [
  'Glioma',
  'Meningioma',
  'No Tumor',
  'Pituitary',
];

export const MODEL_CONFIG = {
  INDEXED_DB_NAME: 'neuroscan-model',
  INDEXED_DB_URI: 'indexeddb://neuroscan-model',
  LOCAL_MODEL_PATH: '/tfjs_model/model.json',
  INPUT_SHAPE: [1, 256, 256, 3] as const,
  INPUT_WIDTH: 256,
  INPUT_HEIGHT: 256,
  INPUT_CHANNELS: 3,
  NORMALIZATION_FACTOR: 255.0,
};

export const CLASS_METADATA: Record<
  TumorClass,
  {
    riskTier: 'healthy' | 'caution' | 'critical';
    primaryColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    description: string;
    clinicalSummary: string;
  }
> = {
  'No Tumor': {
    riskTier: 'healthy',
    primaryColor: '#059669',
    badgeBg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    badgeBorder: 'border-emerald-300',
    badgeText: 'text-emerald-800',
    description: 'Normal anatomical brain structures without pathological mass effect or abnormal focal signal intensity.',
    clinicalSummary: 'No focal mass, abnormal contrast enhancement, or midline shift detected.',
  },
  Glioma: {
    riskTier: 'critical',
    primaryColor: '#DC2626',
    badgeBg: 'bg-rose-50 border-rose-300 text-rose-800',
    badgeBorder: 'border-rose-300',
    badgeText: 'text-rose-800',
    description: 'Intra-axial glial cell neoplasm arising from supportive brain tissue, displaying infiltrative margins.',
    clinicalSummary: 'High probability of intra-axial neoplastic proliferation. Immediate neurological consultation advised.',
  },
  Meningioma: {
    riskTier: 'caution',
    primaryColor: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-300 text-amber-800',
    badgeBorder: 'border-amber-300',
    badgeText: 'text-amber-800',
    description: 'Predominantly extra-axial mass arising from arachnoid cap cells of the meninges, dural-based.',
    clinicalSummary: 'Likely extra-axial dural-based mass. Recommend contrast-enhanced MR characterization.',
  },
  Pituitary: {
    riskTier: 'caution',
    primaryColor: '#7C3AED',
    badgeBg: 'bg-purple-50 border-purple-300 text-purple-800',
    badgeBorder: 'border-purple-300',
    badgeText: 'text-purple-800',
    description: 'Sellar/parasellar region neoplasm originating within the pituitary gland.',
    clinicalSummary: 'Sellar region enlargement or abnormal signal. Correlate with endocrinological panel.',
  },
};

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  invert: false,
  colormap: 'grayscale',
  zoom: 1.0,
};

// Preset sample MRI scans
export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'preset-glioma',
    label: 'Glioma Case A',
    category: 'Glioma',
    description: 'T1 post-contrast axial slice with left fronto-temporal mass effect',
    imageSrc: '/samples/glioma_sample.png',
    viewType: 'Axial T1+C',
  },
  {
    id: 'preset-meningioma',
    label: 'Meningioma Case B',
    category: 'Meningioma',
    description: 'Parasagittal extra-axial lesion with marked dural attachment',
    imageSrc: '/samples/meningioma_sample.png',
    viewType: 'Axial T1+C',
  },
  {
    id: 'preset-healthy',
    label: 'Normal Scan C',
    category: 'No Tumor',
    description: 'Unremarkable brain MRI, normal ventricular symmetry and sulcal pattern',
    imageSrc: '/samples/notumor_sample.png',
    viewType: 'Axial T2/FLAIR',
  },
  {
    id: 'preset-pituitary',
    label: 'Pituitary Case D',
    category: 'Pituitary',
    description: 'Sellar region mass expanding into suprasellar cistern',
    imageSrc: '/samples/pituitary_sample.png',
    viewType: 'Coronal T1+C',
  },
];
