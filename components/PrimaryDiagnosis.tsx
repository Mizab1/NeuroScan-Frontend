'use client';

import React from 'react';
import {
  AlertOctagon,
  ShieldCheck,
  Zap,
  FileText
} from 'lucide-react';
import { InferenceResult } from '@/lib/types';
import { CLASS_METADATA } from '@/lib/constants';

interface PrimaryDiagnosisProps {
  result: InferenceResult;
  onOpenReport: () => void;
}

export const PrimaryDiagnosis: React.FC<PrimaryDiagnosisProps> = ({
  result,
  onOpenReport,
}) => {
  const meta = CLASS_METADATA[result.topClass];
  const isHealthy = result.isHealthy;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 ${
        isHealthy
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 text-emerald-950'
          : 'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-rose-50/30 text-rose-950'
      }`}
    >
      <div className="relative flex flex-col gap-4">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs ${
                isHealthy
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
                  : 'border-rose-300 bg-rose-100 text-rose-700'
              }`}
            >
              {isHealthy ? (
                <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
              ) : (
                <AlertOctagon className="h-6 w-6 stroke-[2.2] animate-pulse" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Primary Classification
              </span>
              <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
                isHealthy ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {isHealthy ? 'No Tumor Detected' : `${result.topClass} Tumor`}
              </h2>
            </div>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Confidence
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-2xl font-black tracking-tight text-slate-900">
                {(result.topConfidence * 100).toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>
          </div>

        </div>

        {/* Clinical Summary Banner */}
        <div className="rounded-xl border border-slate-200 bg-white/90 p-3.5 text-xs text-slate-700 shadow-2xs">
          <p className="font-bold text-slate-900">
            {meta.clinicalSummary}
          </p>
          <p className="mt-1 text-[11px] text-slate-600">
            {meta.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-200/80 pt-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <Zap className="h-3.5 w-3.5 text-cyan-600" />
            <span>Latency: <strong className="font-mono text-slate-900">{result.inferenceTimeMs}ms</strong></span>
            {result.isSimulated && (
              <span className="rounded-md bg-amber-100 border border-amber-300 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                Simulated Run
              </span>
            )}
          </div>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generate Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};
