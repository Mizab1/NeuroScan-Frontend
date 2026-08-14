'use client';

import React from 'react';
import { Cpu, Gauge, Layers, Lock, Sparkles, Timer } from 'lucide-react';
import { InferenceResult } from '@/lib/types';

interface BenchmarkMetricsProps {
  result: InferenceResult;
  activeTensors: number;
}

export const BenchmarkMetrics: React.FC<BenchmarkMetricsProps> = ({
  result,
  activeTensors,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Hardware & Performance Telemetry
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
          <Lock className="h-3 w-3" /> Client-Side Only
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Latency */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Timer className="h-3 w-3 text-cyan-600" /> Latency
          </span>
          <span className="font-mono text-sm font-bold text-slate-900 mt-1">
            {result.inferenceTimeMs} ms
          </span>
        </div>

        {/* Input Shape */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Cpu className="h-3 w-3 text-indigo-600" /> Input Shape
          </span>
          <span className="font-mono text-xs font-bold text-slate-900 mt-1 truncate">
            (1, 256, 256, 3)
          </span>
        </div>

        {/* Acceleration */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-teal-600" /> Engine
          </span>
          <span className="font-mono text-xs font-bold text-slate-900 mt-1 truncate uppercase">
            {result.deviceBackend}
          </span>
        </div>

        {/* Tensor Memory Health */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex flex-col">
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
            <Layers className="h-3 w-3 text-emerald-600" /> Memory Guard
          </span>
          <span className="font-mono text-xs font-bold text-emerald-700 mt-1">
            tf.tidy active
          </span>
        </div>

      </div>
    </div>
  );
};
