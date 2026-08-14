import { ImageAdjustments } from './types';

export interface ValidatedFile {
  isValid: boolean;
  error?: string;
  dataUrl?: string;
  file?: File;
}

export function validateImageFile(file: File): Promise<ValidatedFile> {
  return new Promise((resolve) => {
    // 1. Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      return resolve({
        isValid: false,
        error: `Unsupported format (${file.type || 'unknown'}). Please upload a PNG, JPEG, or WebP MRI scan.`,
      });
    }

    // 2. Validate file size (max 20MB)
    const MAX_SIZE_BYTES = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return resolve({
        isValid: false,
        error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 20MB.`,
      });
    }

    // 3. Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth < 32 || img.naturalHeight < 32) {
          resolve({
            isValid: false,
            error: 'Image resolution is too low for diagnostic processing (min 32x32px).',
          });
        } else {
          resolve({
            isValid: true,
            dataUrl,
            file,
          });
        }
      };
      img.onerror = () => {
        resolve({
          isValid: false,
          error: 'Corrupted image file could not be decoded.',
        });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      resolve({
        isValid: false,
        error: 'Failed to read file from local storage.',
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Renders an image to an offscreen/onscreen canvas with custom clinical adjustments (contrast, brightness, colormap)
 */
export function applyAdjustmentsToCanvas(
  sourceImage: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  adjustments: ImageAdjustments
) {
  const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const { width, height } = targetCanvas;
  ctx.clearRect(0, 0, width, height);

  // Apply filters
  let filterStr = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%)`;
  if (adjustments.invert || adjustments.colormap === 'invert') {
    filterStr += ' invert(100%)';
  }
  ctx.filter = filterStr;

  // Center crop / aspect fill
  const imgAspect = sourceImage.naturalWidth / sourceImage.naturalHeight;
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

  // Zoom scale
  if (adjustments.zoom > 1.0) {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(adjustments.zoom, adjustments.zoom);
    ctx.translate(-width / 2, -height / 2);
  }

  ctx.drawImage(sourceImage, drawX, drawY, drawW, drawH);

  if (adjustments.zoom > 1.0) {
    ctx.restore();
  }

  // Reset filter
  ctx.filter = 'none';

  // Apply colormap if thermal / contrast-enhanced is selected
  if (adjustments.colormap === 'thermal') {
    applyThermalColormap(ctx, width, height);
  }
}

function applyThermalColormap(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    
    // Thermal spectrum (Blue -> Cyan -> Yellow -> Red)
    let r = 0, g = 0, b = 0;
    if (gray < 0.25) {
      b = gray * 4 * 255;
    } else if (gray < 0.5) {
      g = (gray - 0.25) * 4 * 255;
      b = 255;
    } else if (gray < 0.75) {
      r = (gray - 0.5) * 4 * 255;
      g = 255;
      b = 255 - (gray - 0.5) * 4 * 255;
    } else {
      r = 255;
      g = 255 - (gray - 0.75) * 4 * 255;
      b = 0;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generate procedural realistic MRI canvas data for presets
 */
export function generateProceduralMRIDataUrl(type: 'glioma' | 'meningioma' | 'healthy' | 'pituitary'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = 256;
  const cy = 256;

  // Background
  ctx.fillStyle = '#06080D';
  ctx.fillRect(0, 0, 512, 512);

  // Skull outline
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, 185, 215, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1e2430';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#64748b';
  ctx.stroke();

  // Subcutaneous fat & CSF layer
  ctx.beginPath();
  ctx.ellipse(cx, cy, 172, 202, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0d14';
  ctx.fill();

  // Brain parenchyma (cortex)
  ctx.beginPath();
  ctx.ellipse(cx, cy, 160, 190, 0, 0, Math.PI * 2);
  const cortexGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 160);
  cortexGrad.addColorStop(0, '#5a6270');
  cortexGrad.addColorStop(0.7, '#47505e');
  cortexGrad.addColorStop(1, '#333b47');
  ctx.fillStyle = cortexGrad;
  ctx.fill();

  // Brain Sulci and Gyri patterns
  ctx.strokeStyle = '#222834';
  ctx.lineWidth = 2.5;
  for (let angle = 0; angle < Math.PI * 2; angle += 0.18) {
    const r1 = 120 + Math.sin(angle * 6) * 25;
    const r2 = 158;
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = cy + Math.sin(angle) * r1 * 1.15;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = cy + Math.sin(angle) * r2 * 1.15;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(
      x1 + Math.sin(angle) * 12,
      y1 - Math.cos(angle) * 12,
      x2,
      y2
    );
    ctx.stroke();
  }

  // Interhemispheric Fissure (midline)
  ctx.beginPath();
  ctx.moveTo(cx, cy - 180);
  ctx.lineTo(cx, cy + 180);
  ctx.strokeStyle = '#181e28';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ventricles
  ctx.fillStyle = '#11151c';
  // Left lateral ventricle
  ctx.beginPath();
  ctx.ellipse(cx - 28, cy - 15, 14, 45, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Right lateral ventricle
  ctx.beginPath();
  ctx.ellipse(cx + 28, cy - 15, 14, 45, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Draw Specific Pathology according to case type
  if (type === 'glioma') {
    // High-grade irregular ring-enhancing mass in right fronto-parietal region
    const tx = cx + 65;
    const ty = cy - 40;

    // Surrounding vasogenic edema
    const edemaGrad = ctx.createRadialGradient(tx, ty, 10, tx, ty, 75);
    edemaGrad.addColorStop(0, 'rgba(180, 195, 215, 0.4)');
    edemaGrad.addColorStop(1, 'rgba(70, 80, 95, 0)');
    ctx.fillStyle = edemaGrad;
    ctx.beginPath();
    ctx.arc(tx, ty, 75, 0, Math.PI * 2);
    ctx.fill();

    // Hyperintense irregular tumor rim
    ctx.beginPath();
    ctx.ellipse(tx, ty, 42, 36, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#d1d8e0';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Central necrotic core
    ctx.beginPath();
    ctx.ellipse(tx - 3, ty + 2, 22, 18, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#1c222b';
    ctx.fill();
  } else if (type === 'meningioma') {
    // Extra-axial dural based homogeneous enhancing mass
    const tx = cx - 118;
    const ty = cy - 65;

    ctx.beginPath();
    ctx.ellipse(tx, ty, 38, 32, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Dural tail sign
    ctx.beginPath();
    ctx.moveTo(tx - 25, ty + 28);
    ctx.lineTo(tx - 40, ty + 50);
    ctx.lineTo(tx - 15, ty + 38);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
  } else if (type === 'pituitary') {
    // Sellar mass expanding suprasellar
    const tx = cx;
    const ty = cy + 45;

    ctx.beginPath();
    ctx.ellipse(tx, ty, 30, 24, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#cbd5e1';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  // Scan metadata stamp (clinical HUD)
  ctx.restore();
  ctx.font = '11px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`NEUROSCAN_MRI_${type.toUpperCase()}`, 20, 30);
  ctx.fillText('TE: 14.2ms  TR: 480ms  FA: 90°', 20, 48);
  ctx.fillText('AXIAL 256x256 T1+C', 20, 500);
  ctx.fillText('FOV: 220mm  THK: 3.0mm', 340, 500);

  return canvas.toDataURL('image/png');
}
