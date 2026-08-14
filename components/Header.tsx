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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200 shadow-xs">
            <Activity className="h-5 w-5 text-cyan-600 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Neuro<span className="text-cyan-600">Scan</span>
              </h1>
              <span className="rounded-full bg-cyan-50 border border-cyan-200 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 tracking-wide uppercase">
                AI Inference
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Client-Side 5-Layer CNN MRI Classifier
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Backend Accelerator Badge */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 md:flex">
            <Cpu className="h-3.5 w-3.5 text-cyan-600" />
            <span className="text-slate-500">Backend:</span>
            <span className="font-mono font-semibold text-cyan-700 uppercase">
              {status.backend}
            </span>
          </div>

          {/* IndexedDB Cache Status */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 lg:flex">
            <Database className={`h-3.5 w-3.5 ${status.isCachedInIndexedDB ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span className="text-slate-500">IndexedDB:</span>
            <span className={`font-semibold ${status.isCachedInIndexedDB ? 'text-emerald-700' : 'text-amber-700'}`}>
              {status.isCachedInIndexedDB ? 'Cached' : 'Network'}
            </span>
          </div>

          {/* Active Tensor Leak Monitor */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 sm:flex">
            <Layers className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-slate-500">Tensors:</span>
            <span className="font-mono font-semibold text-indigo-700">
              {activeTensors}
            </span>
          </div>

          {/* Reload / Re-cache Button */}
          <button
            onClick={onRefreshModel}
            title="Reload model & clear cache"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Model Info Modal Trigger */}
          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 hover:border-cyan-300 transition-all shadow-xs"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Model Info</span>
          </button>

        </div>
      </div>
    </header>
  );
};
