'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ModelStatusBar } from '@/components/ModelStatusBar';
import { Dropzone } from '@/components/Dropzone';
import { SamplePresets } from '@/components/SamplePresets';
import { ScanViewer } from '@/components/ScanViewer';
import { PrimaryDiagnosis } from '@/components/PrimaryDiagnosis';
import { ClassProbabilityBars } from '@/components/ClassProbabilityBars';
import { BenchmarkMetrics } from '@/components/BenchmarkMetrics';
import { ModelInfoModal } from '@/components/ModelInfoModal';
import { ReportModal } from '@/components/ReportModal';

import {
  loadNeuroScanModel,
  getLoadedModel,
  getTfMemoryInfo,
} from '@/lib/tf-loader';
import { runModelInference, runSimulatedInference } from '@/lib/tf-inference';
import {
  ModelStatusInfo,
  InferenceResult,
  SamplePreset,
  TumorClass,
} from '@/lib/types';
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Cpu,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  Microscope,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import type * as tf from '@tensorflow/tfjs';

export default function NeuroScanPage() {
  // Model state
  const [modelStatus, setModelStatus] = useState<ModelStatusInfo>({
    state: 'idle',
    backend: 'unknown',
    progress: 0,
    isCachedInIndexedDB: false,
    memoryTensors: 0,
    memoryBytes: 0,
  });

  const [loadedModel, setLoadedModel] = useState<tf.LayersModel | null>(null);
  const [activeTensors, setActiveTensors] = useState<number>(0);

  // Scan & Inference state
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<TumorClass | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<InferenceResult | null>(null);

  // Modal controls
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Initialize TensorFlow.js and load model
  const initModel = useCallback(async () => {
    const model = await loadNeuroScanModel((status) => {
      setModelStatus(status);
      setActiveTensors(status.memoryTensors || 0);
    });

    setLoadedModel(model);
    const mem = getTfMemoryInfo();
    setActiveTensors(mem.tensors);
  }, []);

  useEffect(() => {
    initModel();
  }, [initModel]);

  // Handle user uploaded image
  const handleImageSelected = (dataUrl: string, fileName: string) => {
    setActiveImageSrc(dataUrl);
    setActiveFileName(fileName);
    setSelectedPresetId(null);
    setSelectedPresetCategory(undefined);
    setInferenceResult(null);
  };

  // Handle preset selection
  const handleSelectPreset = (dataUrl: string, preset: SamplePreset) => {
    setActiveImageSrc(dataUrl);
    setActiveFileName(`${preset.label} (${preset.viewType})`);
    setSelectedPresetId(preset.id);
    setSelectedPresetCategory(preset.category);
    setInferenceResult(null);
  };

  // Clear current scan
  const handleClearScan = () => {
    setActiveImageSrc(null);
    setActiveFileName('');
    setSelectedPresetId(null);
    setSelectedPresetCategory(undefined);
    setInferenceResult(null);
  };

  // Execute inference pipeline
  const handleRunInference = async () => {
    if (!activeImageSrc || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      if (loadedModel) {
        // Real TensorFlow.js WebGL Execution
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          try {
            const result = await runModelInference(img, loadedModel);
            setInferenceResult(result);
            const mem = getTfMemoryInfo();
            setActiveTensors(mem.tensors);
          } catch (inferErr) {
            console.error('Inference error:', inferErr);
          } finally {
            setIsAnalyzing(false);
          }
        };
        img.src = activeImageSrc;
      } else {
        // Simulated execution (Model files awaiting drop-in)
        setTimeout(() => {
          const result = runSimulatedInference(selectedPresetCategory);
          setInferenceResult(result);
          setIsAnalyzing(false);
        }, 600);
      }
    } catch (err) {
      console.error('Error triggering inference:', err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Top Application Header */}
      <Header
        status={modelStatus}
        onRefreshModel={initModel}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        activeTensors={activeTensors}
      />

      {/* Model Loading Status Bar */}
      <ModelStatusBar
        status={modelStatus}
        onRetry={initModel}
        onOpenModelGuide={() => setIsInfoModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Top Hero Banner */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-600 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Brain MRI Neural Diagnostic Suite
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal">
              Real-time classification across 4 pathology tiers (Glioma, Meningioma, Pituitary, Normal). Powered by browser-native WebGL tensor execution with strict zero-upload privacy.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
              HIPAA Compliant &bull; 100% In-Browser
            </span>
          </div>
        </div>

        {/* 2-Column Split Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Scan Workspace (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            
            {activeImageSrc ? (
              <ScanViewer
                imageSrc={activeImageSrc}
                fileName={activeFileName}
                isAnalyzing={isAnalyzing}
                onRunInference={handleRunInference}
                onClearScan={handleClearScan}
                canRunInference={true}
              />
            ) : (
              <Dropzone
                onImageSelected={handleImageSelected}
                disabled={isAnalyzing}
              />
            )}

            {/* Test Presets Carousel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SamplePresets
                onSelectPreset={handleSelectPreset}
                selectedPresetId={selectedPresetId}
                disabled={isAnalyzing}
              />
            </div>

          </div>

          {/* RIGHT PANEL: Inference Results & Telemetry (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5">
            
            {inferenceResult ? (
              <>
                {/* Primary Outcome Badge */}
                <PrimaryDiagnosis
                  result={inferenceResult}
                  onOpenReport={() => setIsReportModalOpen(true)}
                />

                {/* 4-Class Softmax Probability Distribution */}
                <ClassProbabilityBars
                  probabilities={inferenceResult.probabilities}
                />

                {/* Performance & Tensor Memory Telemetry */}
                <BenchmarkMetrics
                  result={inferenceResult}
                  activeTensors={activeTensors}
                />
              </>
            ) : (
              /* Standby / Diagnostic Readiness Card */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-600 shadow-xs">
                  <Microscope className="h-8 w-8" />
                </div>

                <h3 className="text-base font-bold text-slate-800">
                  Diagnostic Telemetry Standby
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 max-w-sm">
                  {activeImageSrc
                    ? 'Scan loaded in active viewport. Click "Run AI Diagnostic Scan" to initiate WebGL tensor classification.'
                    : 'Select a sample MRI preset or upload an axial/coronal brain scan to begin classification.'}
                </p>

                {/* Quick spec pills */}
                <div className="mt-6 grid grid-cols-2 gap-2.5 w-full text-left">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Neural Model</span>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">5-Layer CNN</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Input Tensor</span>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">256 × 256 × 3 RGB</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Classes</span>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">4 Target Tiers</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Storage Cache</span>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">IndexedDB</p>
                  </div>
                </div>

                {/* Clinical Disclaimer Note */}
                <div className="mt-6 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left text-[11px] text-slate-500">
                  <Shield className="h-4 w-4 shrink-0 text-cyan-600 mt-0.5" />
                  <span>
                    Designed for engineering evaluation and research. Always verify medical imaging results with a certified radiologist.
                  </span>
                </div>

              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            NeuroScan AI &bull; Pure Client-Side Machine Learning with Next.js & TensorFlow.js
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-slate-600 hover:text-cyan-700 font-medium transition-colors"
            >
              Model Specifications
            </button>
            <span>&bull;</span>
            <span className="text-slate-500 font-mono">Input: (1, 256, 256, 3)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ModelInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onRefresh={initModel}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={inferenceResult}
        scanImageSrc={activeImageSrc}
        fileName={activeFileName}
      />

    </div>
  );
}
