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
    primaryColor: '#10B981',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    description: 'Normal anatomical structures without pathological mass effect or abnormal signal intensity.',
    clinicalSummary: 'No focal mass, abnormal enhancement, or midline shift detected in standard view.',
  },
  Glioma: {
    riskTier: 'critical',
    primaryColor: '#EF4444',
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-300',
    description: 'Intra-axial glial cell neoplasm arising from supportive brain tissue, often displaying infiltrative margins.',
    clinicalSummary: 'High probability of intra-axial neoplastic proliferation. Suggest immediate neurological consultation.',
  },
  Meningioma: {
    riskTier: 'caution',
    primaryColor: '#F59E0B',
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    description: 'Predominantly extra-axial mass arising from arachnoid cap cells of the meninges, often dural-based.',
    clinicalSummary: 'Likely extra-axial dural-based mass. Recommend contrast-enhanced MR characterization.',
  },
  Pituitary: {
    riskTier: 'caution',
    primaryColor: '#8B5CF6',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    badgeBorder: 'border-indigo-500/40',
    badgeText: 'text-indigo-300',
    description: 'Sellar/parasellar region neoplasm originating within the anterior pituitary gland.',
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

// Preset high-fidelity SVG/Base64 sample MRI scans
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
