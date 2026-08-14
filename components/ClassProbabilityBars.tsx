'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ClassProbability } from '@/lib/types';

interface ClassProbabilityBarsProps {
  probabilities: ClassProbability[];
}

export const ClassProbabilityBars: React.FC<ClassProbabilityBarsProps> = ({
  probabilities,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Probability Distribution (4 Classes)
          </h3>
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-400">Softmax Output</span>
      </div>

      <div className="space-y-3.5">
        {probabilities.map((prob) => {
          const isTop = prob.isTopPrediction;

          return (
            <div key={prob.className} className="group">
              
              {/* Row Header */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isTop
                        ? prob.className === 'No Tumor'
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-rose-500 ring-2 ring-rose-200'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors ${
                      isTop ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                    }`}
                  >
                    {prob.className}
                  </span>
                  {isTop && (
                    <span className="rounded-md bg-cyan-50 border border-cyan-200 px-1.5 py-0.2 text-[9px] font-bold text-cyan-800 uppercase">
                      Top Match
                    </span>
                  )}
                </div>

                <span
                  className={`font-mono text-xs ${
                    isTop ? 'font-bold text-cyan-700' : 'text-slate-500'
                  }`}
                >
                  {prob.formattedPercent}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isTop
                      ? prob.className === 'No Tumor'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-xs'
                      : 'bg-slate-300'
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
