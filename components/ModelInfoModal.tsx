'use client';

import React from 'react';
import { X, Layers, Cpu, HardDrive, Trash2 } from 'lucide-react';
import { clearIndexedDBCache } from '@/lib/tf-loader';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  if (!isOpen) return null;

  const handleClearCache = async () => {
    await clearIndexedDBCache();
    onRefresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 shadow-2xs">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                NeuroScan Model Specifications
              </h3>
              <p className="text-xs text-slate-500">
                Client-Side TensorFlow.js Neural Classifier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Specifications Grid */}
        <div className="space-y-4 text-xs text-slate-700">
          
          {/* Section: Model Topology */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <h4 className="font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-cyan-600" />
              Input & Output Contract
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 font-medium">Input Tensor Shape:</span>
                <p className="font-mono font-bold text-cyan-800 mt-0.5">(1, 256, 256, 3)</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Pixel Normalization:</span>
                <p className="font-mono font-bold text-cyan-800 mt-0.5">x / 255.0 &rarr; [0.0, 1.0]</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Output Layer Activation:</span>
                <p className="font-mono font-bold text-cyan-800 mt-0.5">Softmax (4 Probability Classes)</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Target Output Classes:</span>
                <p className="font-mono font-bold text-cyan-800 mt-0.5">Glioma, Meningioma, No Tumor, Pituitary</p>
              </div>
            </div>
          </div>

          {/* Section: Storage Cache Management */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2.5">
              <HardDrive className="h-4 w-4 text-slate-500" />
              <div>
                <p className="font-bold text-slate-900">IndexedDB Offline Model Cache</p>
                <p className="text-[11px] text-slate-500">URI: <code className="font-mono font-medium">indexeddb://neuroscan-model</code></p>
              </div>
            </div>
            <button
              onClick={handleClearCache}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Purge Cache
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
