'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileUp, AlertTriangle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { validateImageFile } from '@/lib/image-utils';

interface DropzoneProps {
  onImageSelected: (dataUrl: string, fileName: string, file: File | null) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onImageSelected,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle global or element paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            handleProcessFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled]);

  const handleProcessFile = async (file: File) => {
    setValidationError(null);
    const result = await validateImageFile(file);

    if (!result.isValid || !result.dataUrl) {
      setValidationError(result.error || 'Invalid MRI image file.');
      return;
    }

    onImageSelected(result.dataUrl, file.name, file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-cyan-500 bg-cyan-50/80 scale-[1.01] shadow-lg shadow-cyan-100'
            : 'border-slate-300 bg-white hover:border-cyan-400 hover:bg-slate-50/80 shadow-xs'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Reticle Corner Marks */}
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-slate-300 group-hover:border-cyan-500 transition-colors" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-slate-300 group-hover:border-cyan-500 transition-colors" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-slate-300 group-hover:border-cyan-500 transition-colors" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-slate-300 group-hover:border-cyan-500 transition-colors" />

        {/* Upload Icon */}
        <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-700 group-hover:scale-105 group-hover:bg-cyan-100 transition-all shadow-xs">
          <Upload className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
        </div>

        <h3 className="text-base font-bold text-slate-800 group-hover:text-cyan-900">
          Drop MRI scan here, or <span className="text-cyan-600 underline underline-offset-4">browse</span>
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 max-w-sm">
          Supports <span className="text-slate-700 font-mono font-medium">PNG</span>, <span className="text-slate-700 font-mono font-medium">JPEG</span>, <span className="text-slate-700 font-mono font-medium">WEBP</span>. Paste directly from clipboard (<kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">Ctrl+V</kbd>).
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs">
          <Sparkles className="h-3 w-3 text-cyan-600" />
          <span>Pure client-side processing &bull; Zero server uploads</span>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800 shadow-xs">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
