'use client';

import React from 'react';
import { Activity, Cpu, Database, Info, Layers, RefreshCw } from 'lucide-react';
import { ModelStatusInfo } from '@/lib/types';

interface HeaderProps {
  status: ModelStatusInfo;
  onRefreshModel: () => void;
  onOpenInfoModal: () => void;
  activeTensors: number;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  onRefreshModel,
  onOpenInfoModal,
  activeTensors,
}) => {
  const isReady = status.state === 'ready';
  const isMissing = status.state === 'model-missing';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 shadow-inner">
            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            <div className="absolute -inset-0.5 rounded-xl bg-cyan-500/20 blur-sm -z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Neuro<span className="text-cyan-400">Scan</span>
              </h1>
              <span className="rounded-full bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 tracking-wide uppercase">
                AI Inference
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Client-Side 5-Layer CNN MRI Classifier
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Backend Accelerator Badge */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 md:flex">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400">Backend:</span>
            <span className="font-mono font-medium text-cyan-300 uppercase">
              {status.backend}
            </span>
          </div>

          {/* IndexedDB Cache Status */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 lg:flex">
            <Database className={`h-3.5 w-3.5 ${status.isCachedInIndexedDB ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-400">IndexedDB:</span>
            <span className={`font-medium ${status.isCachedInIndexedDB ? 'text-emerald-400' : 'text-amber-400'}`}>
              {status.isCachedInIndexedDB ? 'Cached' : 'Network'}
            </span>
          </div>

          {/* Active Tensor Leak Monitor */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs text-slate-300 sm:flex">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">Tensors:</span>
            <span className="font-mono font-medium text-indigo-300">
              {activeTensors}
            </span>
          </div>

          {/* Reload / Re-cache Button */}
          <button
            onClick={onRefreshModel}
            title="Reload model & clear cache"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Model Info Modal Trigger */}
          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Model Info</span>
          </button>

        </div>
      </div>
    </header>
  );
};
