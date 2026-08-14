'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Cpu, Database, Flame, Loader2, Sparkles, UploadCloud } from 'lucide-react';
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
    return null; // Model is operational, header badges reflect status
  }

  if (status.state === 'model-missing') {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-300">
                Model Awaiting Deployment in <code className="rounded bg-amber-950/80 px-1.5 py-0.5 text-xs text-amber-200 border border-amber-500/30 font-mono">public/tfjs_model/</code>
              </h4>
              <p className="mt-0.5 text-xs text-slate-400">
                Interactive preview & simulation mode is active. You can test all upload features, image filters, and presets immediately. Drop your <code className="text-slate-300 font-mono">model.json</code> and <code className="text-slate-300 font-mono">.bin</code> shards into <code className="text-slate-300 font-mono">public/tfjs_model/</code> to enable real-time WebGL inference.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={onOpenModelGuide}
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              Setup Guide
            </button>
            <button
              onClick={onRetry}
              className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/30 transition-colors"
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
        <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold">TensorFlow.js Engine Error</p>
              <p className="text-xs text-rose-300/80">{status.errorMessage || 'An error occurred during model initialization.'}</p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-200 hover:bg-rose-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading States: checking-cache, downloading, compiling, warming-up
  const stateLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    'checking-cache': {
      label: 'Inspecting IndexedDB Local Storage Cache...',
      icon: <Database className="h-4 w-4 text-cyan-400 animate-spin" />,
    },
    downloading: {
      label: `Streaming Quantized Model Weights (${status.progress}%)...`,
      icon: <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />,
    },
    compiling: {
      label: 'Compiling TensorFlow.js 5-Layer CNN Topology...',
      icon: <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />,
    },
    'warming-up': {
      label: 'Pre-compiling WebGL Shaders with Warmup Forward Pass (tf.zeros)...',
      icon: <Flame className="h-4 w-4 text-amber-400 animate-bounce" />,
    },
  };

  const currentStep = stateLabels[status.state] || {
    label: 'Initializing Machine Learning Pipeline...',
    icon: <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-cyan-500/20 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
            {currentStep.icon}
            <span>{currentStep.label}</span>
          </div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            {status.progress}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, status.progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
