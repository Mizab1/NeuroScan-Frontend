'use client';

import React from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import { ClassProbability } from '@/lib/types';
import { CLASS_METADATA } from '@/lib/constants';

interface ClassProbabilityBarsProps {
  probabilities: ClassProbability[];
}

export const ClassProbabilityBars: React.FC<ClassProbabilityBarsProps> = ({
  probabilities,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Probability Distribution (4 Classes)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Softmax Output</span>
      </div>

      <div className="space-y-3.5">
        {probabilities.map((prob) => {
          const meta = CLASS_METADATA[prob.className];
          const isTop = prob.isTopPrediction;

          return (
            <div key={prob.className} className="group">
              
              {/* Row Header: Class Name + Value */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isTop
                        ? prob.className === 'No Tumor'
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                          : 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]'
                        : 'bg-slate-600'
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors ${
                      isTop ? 'text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    {prob.className}
                  </span>
                  {isTop && (
                    <span className="rounded bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-semibold text-cyan-300 uppercase">
                      Top Match
                    </span>
                  )}
                </div>

                <span
                  className={`font-mono text-xs ${
                    isTop ? 'font-bold text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {prob.formattedPercent}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isTop
                      ? prob.className === 'No Tumor'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-rose-500 to-amber-400'
                      : 'bg-slate-700/80'
                  }`}
                  style={{ width: `${Math.max(1.5, prob.percentage)}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
