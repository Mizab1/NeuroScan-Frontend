'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Check, Play } from 'lucide-react';
import { SAMPLE_PRESETS, CLASS_METADATA } from '@/lib/constants';
import { SamplePreset, TumorClass } from '@/lib/types';
import { generateProceduralMRIDataUrl } from '@/lib/image-utils';

interface SamplePresetsProps {
  onSelectPreset: (dataUrl: string, preset: SamplePreset) => void;
  selectedPresetId?: string | null;
  disabled?: boolean;
}

export const SamplePresets: React.FC<SamplePresetsProps> = ({
  onSelectPreset,
  selectedPresetId,
  disabled = false,
}) => {
  const [presetThumbnails, setPresetThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate high-resolution procedural MRI assets on client-side
    const thumbs: Record<string, string> = {
      'preset-glioma': generateProceduralMRIDataUrl('glioma'),
      'preset-meningioma': generateProceduralMRIDataUrl('meningioma'),
      'preset-healthy': generateProceduralMRIDataUrl('healthy'),
      'preset-pituitary': generateProceduralMRIDataUrl('pituitary'),
    };
    setPresetThumbnails(thumbs);
  }, []);

  const handleSelect = (preset: SamplePreset) => {
    if (disabled) return;
    const dataUrl = presetThumbnails[preset.id] || generateProceduralMRIDataUrl(
      preset.category === 'Glioma' ? 'glioma' :
      preset.category === 'Meningioma' ? 'meningioma' :
      preset.category === 'No Tumor' ? 'healthy' : 'pituitary'
    );
    onSelectPreset(dataUrl, preset);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Instant Test Presets (4 Classes)
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">1-Click Load</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {SAMPLE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          const meta = CLASS_METADATA[preset.category];
          const thumbSrc = presetThumbnails[preset.id];

          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              disabled={disabled}
              className={`group relative flex flex-col overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-cyan-400 bg-slate-800/90 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                  : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Thumbnail with overlay badge */}
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-950 border border-slate-800/80 mb-2">
                {thumbSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbSrc}
                    alt={preset.label}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600 text-xs">
                    Loading...
                  </div>
                )}

                {/* Case Badge */}
                <div className="absolute top-1.5 left-1.5">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${meta.badgeBg}`}>
                    {preset.category}
                  </span>
                </div>

                {/* Active checkmark */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                  {preset.label}
                </span>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {preset.viewType}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
