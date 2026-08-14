'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Sliders,
  RotateCcw,
  ZoomIn,
  Sun,
  Contrast as ContrastIcon,
  Eye,
  Trash2,
  Play,
  Loader2,
  Scan,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { ImageAdjustments } from '@/lib/types';
import { DEFAULT_ADJUSTMENTS } from '@/lib/constants';
import { applyAdjustmentsToCanvas } from '@/lib/image-utils';

interface ScanViewerProps {
  imageSrc: string;
  fileName: string;
  isAnalyzing: boolean;
  onRunInference: () => void;
  onClearScan: () => void;
  canRunInference: boolean;
}

export const ScanViewer: React.FC<ScanViewerProps> = ({
  imageSrc,
  fileName,
  isAnalyzing,
  onRunInference,
  onClearScan,
  canRunInference,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [showControls, setShowControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementRef.current = img;
      setIsLoaded(true);
      renderCanvas(img, adjustments);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (imageElementRef.current && isLoaded) {
      renderCanvas(imageElementRef.current, adjustments);
    }
  }, [adjustments, isLoaded]);

  const renderCanvas = useCallback(
    (img: HTMLImageElement, adj: ImageAdjustments) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      applyAdjustmentsToCanvas(img, canvas, adj);
    },
    []
  );

  const handleResetAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      
      {/* Viewer Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Scan className="h-4 w-4 text-cyan-600" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
              {fileName}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Target: 256×256×3 (RGB Float32)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowControls(!showControls)}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold transition-colors shadow-2xs ${
              showControls
                ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            onClick={onClearScan}
            title="Clear current scan"
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Adjustments Filter Drawer */}
      {showControls && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-3 text-xs space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-slate-700 font-bold">
            <span>Clinical Image Adjustments</span>
            <button
              onClick={handleResetAdjustments}
              className="flex items-center gap-1 text-[11px] font-semibold text-cyan-700 hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Brightness */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  <Sun className="h-3 w-3 text-amber-600" /> Brightness
                </span>
                <span className="font-mono font-bold text-slate-800">{adjustments.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustments.brightness}
                onChange={(e) =>
                  setAdjustments({ ...adjustments, brightness: Number(e.target.value) })
                }
                className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  <ContrastIcon className="h-3 w-3 text-cyan-600" /> Contrast
                </span>
                <span className="font-mono font-bold text-slate-800">{adjustments.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={adjustments.contrast}
                onChange={(e) =>
                  setAdjustments({ ...adjustments, contrast: Number(e.target.value) })
                }
                className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Zoom */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  <ZoomIn className="h-3 w-3 text-indigo-600" /> Zoom
                </span>
                <span className="font-mono font-bold text-slate-800">{adjustments.zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={adjustments.zoom}
                onChange={(e) =>
                  setAdjustments({ ...adjustments, zoom: Number(e.target.value) })
                }
                className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Colormap Selectors */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
            <span className="text-[11px] font-medium text-slate-600">View Mode:</span>
            <div className="flex gap-1.5 flex-wrap">
              {(['grayscale', 'thermal', 'invert'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAdjustments({ ...adjustments, colormap: mode })}
                  className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    adjustments.colormap === mode
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Stage (Medical Black Viewport) */}
      <div className="relative aspect-square w-full max-w-[480px] mx-auto overflow-hidden rounded-2xl bg-black border border-slate-300 shadow-lg flex items-center justify-center">
        
        {/* Canvas Display */}
        <canvas
          ref={canvasRef}
          width={512}
          height={512}
          className="h-full w-full object-contain"
        />

        {/* Diagnostic HUD Reticle Overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-400/20" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-400/20" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full border border-cyan-400/25" />
          
          <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-400/80 font-semibold">
            FOV: 256mm
          </div>
          <div className="absolute top-2 right-2 text-[9px] font-mono text-cyan-400/80 font-semibold">
            NORM: [0, 1]
          </div>
          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-cyan-400/80 font-semibold">
            BILINEAR 256×256
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-cyan-400/80 font-semibold">
            TIDY_GUARD: ON
          </div>
        </div>

        {/* Animated Scanning Beam */}
        {isAnalyzing && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="h-full w-full animate-scan bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 border-b-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={onRunInference}
          disabled={!canRunInference || isAnalyzing}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 px-4 text-sm font-bold shadow-md transition-all duration-200 ${
            isAnalyzing
              ? 'bg-cyan-100 text-cyan-900 border border-cyan-300 cursor-wait'
              : canRunInference
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-500 hover:to-teal-500 hover:shadow-cyan-600/25 active:scale-[0.99]'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-cyan-700" />
              <span>Executing WebGL Inference Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              <span>Run AI Diagnostic Scan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
