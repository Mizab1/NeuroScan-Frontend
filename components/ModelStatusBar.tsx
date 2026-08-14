'use client';

import React from 'react';
import { AlertCircle, Cpu, Database, Flame, Loader2, UploadCloud } from 'lucide-react';
import { ModelStatusInfo } from '@/lib/types';

interface ModelStatusBarProps {
  status: ModelStatusInfo;
  onRetry: () => void;
  onOpenModelGuide: () => void;
}

export const ModelStatusBar: React.FC<ModelStatusBarProps> = ({
  status,
  onRetry,
  onOpenModelGuide,
}) => {
  if (status.state === 'ready') {
    return null;
  }

  if (status.state === 'model-missing') {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 border border-amber-200 text-amber-700">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Model Awaiting Deployment in <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-900 border border-amber-300 font-mono">public/tfjs_model/</code>
              </h4>
              <p className="mt-0.5 text-xs text-slate-600">
                Interactive preview mode is active. You can test file uploads, presets, and diagnostic filters. Drop your <code className="text-slate-800 font-mono">model.json</code> and <code className="text-slate-800 font-mono">.bin</code> weight shards into <code className="text-slate-800 font-mono">public/tfjs_model/</code> to engage live WebGL inference.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={onOpenModelGuide}
              className="rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
            >
              Setup Guide
            </button>
            <button
              onClick={onRetry}
              className="rounded-xl bg-amber-600 border border-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors shadow-xs"
            >
              Re-scan Folder
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status.state === 'error') {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-rose-950">TensorFlow.js Engine Error</p>
              <p className="text-xs text-rose-700">{status.errorMessage || 'An error occurred during model initialization.'}</p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading States
  const stateLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    'checking-cache': {
      label: 'Inspecting IndexedDB Local Storage Cache...',
      icon: <Database className="h-4 w-4 text-cyan-600 animate-spin" />,
    },
    downloading: {
      label: `Streaming Quantized Model Weights (${status.progress}%)...`,
      icon: <Loader2 className="h-4 w-4 text-cyan-600 animate-spin" />,
    },
    compiling: {
      label: 'Compiling TensorFlow.js 5-Layer CNN Topology...',
      icon: <Cpu className="h-4 w-4 text-cyan-600 animate-pulse" />,
    },
    'warming-up': {
      label: 'Pre-compiling WebGL Shaders with Warmup Forward Pass (tf.zeros)...',
      icon: <Flame className="h-4 w-4 text-amber-600 animate-bounce" />,
    },
  };

  const currentStep = stateLabels[status.state] || {
    label: 'Initializing Machine Learning Pipeline...',
    icon: <Loader2 className="h-4 w-4 text-cyan-600 animate-spin" />,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-800">
            {currentStep.icon}
            <span>{currentStep.label}</span>
          </div>
          <span className="font-mono text-xs font-bold text-cyan-700">
            {status.progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, status.progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
