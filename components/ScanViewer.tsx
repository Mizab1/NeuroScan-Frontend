'use client';

import React, { useRef, useEffect } from 'react';
import { Trash2, Play, Loader2, Scan } from 'lucide-react';

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

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Aspect-fit image onto canvas
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = width / height;
      let drawW = width;
      let drawH = height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        drawW = height * imgAspect;
        drawX = (width - drawW) / 2;
      } else {
        drawH = width / imgAspect;
        drawY = (height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };
    img.src = imageSrc;
  }, [imageSrc]);

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

        <button
          onClick={onClearScan}
          title="Clear current scan"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

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
