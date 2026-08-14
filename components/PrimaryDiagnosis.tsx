'use client';

import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
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
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        isHealthy
          ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 shadow-lg shadow-emerald-950/20'
          : 'border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 shadow-lg shadow-rose-950/20'
      }`}
    >
      {/* Background radial glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl opacity-20 ${
          isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div className="relative flex flex-col gap-4">
        
        {/* Top Header: Badge + Confidence Gauge */}
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isHealthy
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
              }`}
            >
              {isHealthy ? (
                <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
              ) : (
                <AlertOctagon className="h-6 w-6 stroke-[2.2] animate-pulse" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Primary Classification
              </span>
              <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                isHealthy ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isHealthy ? 'No Tumor Detected' : `${result.topClass} Tumor`}
              </h2>
            </div>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Confidence
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-mono text-2xl font-black tracking-tight text-white">
                {(result.topConfidence * 100).toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">%</span>
            </div>
          </div>

        </div>

        {/* Clinical Summary Banner */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs text-slate-300">
          <p className="font-medium text-slate-200">
            {meta.clinicalSummary}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {meta.description}
          </p>
        </div>

        {/* Footer info: Latency & Report Action */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            <span>Latency: <strong className="font-mono text-slate-200">{result.inferenceTimeMs}ms</strong></span>
            {result.isSimulated && (
              <span className="rounded bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.2 text-[10px] text-amber-300">
                Simulated Run
              </span>
            )}
          </div>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generate Report</span>
          </button>
        </div>

      </div>
    </div>
  );
};
