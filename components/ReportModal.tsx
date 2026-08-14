'use client';

import React from 'react';
import { X, Printer, ShieldAlert, CheckCircle2, FileText, Brain } from 'lucide-react';
import { InferenceResult } from '@/lib/types';
import { CLASS_METADATA } from '@/lib/constants';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: InferenceResult | null;
  scanImageSrc: string | null;
  fileName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  result,
  scanImageSrc,
  fileName,
}) => {
  if (!isOpen || !result) return null;

  const meta = CLASS_METADATA[result.topClass];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto print:max-h-none print:m-0 print:p-0 print:border-none print:bg-white print:text-black">
        
        {/* Header - Screen only */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-600" />
            <h3 className="text-base font-bold text-slate-900">
              Clinical Diagnostic Summary Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 transition-colors shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="space-y-5 print:text-black print:p-8">
          
          {/* Institution & Report Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 print:border-black">
            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-cyan-600 print:text-black" />
                <h1 className="text-xl font-black text-slate-900 print:text-black">
                  NeuroScan AI Diagnostic System
                </h1>
              </div>
              <p className="text-xs text-slate-500 print:text-gray-600 mt-1">
                Automated 5-Layer Convolutional Neural Network Analysis
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-500 print:text-gray-700">
              <p>Report ID: NS-{Math.abs(result.timestamp.getTime() % 1000000)}</p>
              <p>Date: {result.timestamp.toLocaleString()}</p>
            </div>
          </div>

          {/* Patient Scan Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-200 rounded-xl p-3 bg-slate-50 print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-slate-500 font-medium print:text-gray-500">Scan File:</span>
              <p className="font-bold text-slate-900 print:text-black truncate">{fileName}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium print:text-gray-500">Input Resolution:</span>
              <p className="font-bold text-slate-900 print:text-black">{result.inputResolution}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium print:text-gray-500">Execution Hardware:</span>
              <p className="font-bold text-slate-900 print:text-black uppercase">{result.deviceBackend}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium print:text-gray-500">Processing Latency:</span>
              <p className="font-bold text-slate-900 print:text-black font-mono">{result.inferenceTimeMs} ms</p>
            </div>
          </div>

          {/* Primary Outcome Box */}
          <div className={`p-4 rounded-xl border shadow-xs ${
            result.isHealthy 
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950 print:border-emerald-500' 
              : 'border-rose-300 bg-rose-50 text-rose-950 print:border-rose-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500 print:text-gray-600">
                  Primary Classification
                </span>
                <h2 className={`text-2xl font-black ${
                  result.isHealthy ? 'text-emerald-700 print:text-emerald-800' : 'text-rose-700 print:text-rose-800'
                }`}>
                  {result.isHealthy ? 'No Tumor Detected' : `${result.topClass} Tumor`}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 print:text-gray-600">Confidence</span>
                <p className="text-2xl font-mono font-black text-slate-900 print:text-black">
                  {(result.topConfidence * 100).toFixed(2)}%
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-800 font-bold">
              {meta.clinicalSummary}
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              {meta.description}
            </p>
          </div>

          {/* Scan Image & Probability Table */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            {scanImageSrc && (
              <div className="rounded-xl overflow-hidden border border-slate-200 print:border-gray-400 bg-black aspect-square max-w-[200px] mx-auto sm:mx-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scanImageSrc} alt="MRI Scan" className="h-full w-full object-contain" />
              </div>
            )}

            <div className="sm:col-span-2 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 print:border-gray-300">
                Full 4-Class Softmax Probability Distribution
              </h4>
              <div className="space-y-1.5">
                {result.probabilities.map((p) => (
                  <div key={p.className} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 print:bg-gray-100 border border-slate-100">
                    <span className={`font-medium ${p.isTopPrediction ? 'font-bold text-cyan-800 print:text-blue-900' : 'text-slate-600 print:text-gray-700'}`}>
                      {p.className}
                    </span>
                    <span className="font-mono font-bold text-slate-900 print:text-black">
                      {p.formattedPercent}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal / Clinical Disclaimer */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 print:text-gray-500 space-y-1">
            <p className="font-bold text-slate-700">
              IMPORTANT MEDICAL & RESEARCH DISCLAIMER:
            </p>
            <p>
              NeuroScan AI is a purely client-side software prototype designed for machine learning research, educational demonstration, and engineering evaluations. This system does NOT provide certified medical diagnoses, prescriptions, or clinical treatment plans. All automated findings must be independently validated by a qualified, board-certified radiologist or medical professional.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
