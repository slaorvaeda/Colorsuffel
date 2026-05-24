// @ts-nocheck — refs and window.EyeDropper; plain JSX page.
import { useState, useRef, useEffect, useCallback } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CardListSlider from '../components/CardListSlider';
import { FaEyeDropper, FaCopy, FaCheck, FaHeart, FaRegHeart, FaDownload } from 'react-icons/fa';
import { HiArrowTopRightOnSquare, HiPhoto, HiArrowPath, HiTrash } from 'react-icons/hi2';
import tinycolor from 'tinycolor2';
import { Link } from 'react-router-dom';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function newColorId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** tinycolor `toHsl()` uses s,l in 0–1; our canvas path uses 0–100. Normalize for display. */
function normalizeHslForDisplay(hsl) {
  if (!hsl || typeof hsl !== 'object') return { h: 0, s: 0, l: 0 };
  let h = Number(hsl.h) || 0;
  let s = Number(hsl.s) || 0;
  let l = Number(hsl.l) || 0;
  if (s > 0 && s <= 1) s *= 100;
  if (l > 0 && l <= 1) l *= 100;
  return {
    h: Math.round(h * 10) / 10,
    s: Math.round(s * 10) / 10,
    l: Math.round(l * 10) / 10,
  };
}

function ImageColorPicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [extractedColors, setExtractedColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [isSupported, setIsSupported] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    if (!window.EyeDropper) setIsSupported(false);
    try {
      const raw = localStorage.getItem('image-picker-favorites');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavorites(parsed);
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const rgbToHex = (r, g, b) =>
    `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('')}`;

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 3600) / 10,
      s: Math.round(s * 1000) / 10,
      l: Math.round(l * 1000) / 10,
    };
  };

  const getColorName = (hex) => {
    const tc = tinycolor(hex);
    const hsl = tc.toHsl();
    if (hsl.s < 0.1) {
      if (hsl.l > 0.8) return 'White';
      if (hsl.l < 0.2) return 'Black';
      return 'Gray';
    }
    const hue = hsl.h;
    if (hue < 15 || hue > 345) return 'Red';
    if (hue < 45) return 'Orange';
    if (hue < 75) return 'Yellow';
    if (hue < 165) return 'Green';
    if (hue < 195) return 'Cyan';
    if (hue < 255) return 'Blue';
    if (hue < 285) return 'Purple';
    if (hue < 315) return 'Magenta';
    return 'Pink';
  };

  const extractColorsFromImage = useCallback((imageSrc) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsLoading(false);
        return;
      }
      const ctx = canvas.getContext('2d');
      const maxSize = 800;
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const colors = new Map();
      const step = 4;
      for (let i = 0; i < data.length; i += step * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 100) continue;
        const roundedR = Math.round(r / 20) * 20;
        const roundedG = Math.round(g / 20) * 20;
        const roundedB = Math.round(b / 20) * 20;
        const finalR = Math.max(0, Math.min(255, roundedR));
        const finalG = Math.max(0, Math.min(255, roundedG));
        const finalB = Math.max(0, Math.min(255, roundedB));
        const colorKey = `${finalR},${finalG},${finalB}`;
        colors.set(colorKey, (colors.get(colorKey) ?? 0) + 1);
      }
      const colorArray = Array.from(colors.entries())
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          const hex = rgbToHex(r, g, b);
          return {
            hex,
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            count,
            source: 'image',
            name: getColorName(hex),
            id: newColorId(),
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      if (colorArray.length === 0) {
        setExtractedColors([
          { hex: '#FF6B6B', rgb: { r: 255, g: 107, b: 107 }, hsl: { h: 0, s: 100, l: 71 }, count: 1, id: newColorId(), source: 'image' },
          { hex: '#4ECDC4', rgb: { r: 78, g: 205, b: 196 }, hsl: { h: 175, s: 53, l: 55 }, count: 1, id: newColorId(), source: 'image' },
          { hex: '#45B7D1', rgb: { r: 69, g: 183, b: 209 }, hsl: { h: 194, s: 55, l: 55 }, count: 1, id: newColorId(), source: 'image' },
        ]);
      } else {
        setExtractedColors(colorArray);
      }
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = imageSrc;
  }, []);

  const readFileAsImage = (file) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_FILE_BYTES) {
      window.alert(`Please use an image under ${MAX_FILE_BYTES / (1024 * 1024)}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result !== 'string') return;
      setImageUrl(result);
      setSelectedImage(file);
      extractColorsFromImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) readFileAsImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFileAsImage(file);
  };

  const copyToClipboard = async (text, colorType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(colorType);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startColorPicking = async () => {
    if (!window.EyeDropper) {
      window.alert('EyeDropper API is not supported in your browser. Try Chrome, Edge, or Firefox.');
      return;
    }
    try {
      setIsPicking(true);
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const color = result.sRGBHex;
      const tc = tinycolor(color);
      const rawHsl = tc.toHsl();
      const hsl = normalizeHslForDisplay(rawHsl);
      const rgbObj = tc.toRgb();
      const colorInfo = {
        hex: color,
        rgb: { r: rgbObj.r, g: rgbObj.g, b: rgbObj.b },
        hsl,
        name: getColorName(color),
        id: newColorId(),
        source: 'eyedropper',
      };
      setExtractedColors((prev) => {
        const next = [colorInfo, ...prev.filter((c) => c.hex.toLowerCase() !== color.toLowerCase())];
        return next.slice(0, 24);
      });
      await copyToClipboard(color, 'eyedropper-auto');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error picking color:', error);
        window.alert('Could not read that color. Try again.');
      }
    } finally {
      setIsPicking(false);
    }
  };

  const toggleFavorite = (color) => {
    const newFavorites = favorites.find((f) => f.hex === color.hex)
      ? favorites.filter((f) => f.hex !== color.hex)
      : [...favorites, color];
    setFavorites(newFavorites);
    try {
      localStorage.setItem('image-picker-favorites', JSON.stringify(newFavorites));
    } catch {
      /* quota / private mode */
    }
  };

  const downloadPalette = () => {
    const colors = extractedColors.map((c) => c.hex).join('\n');
    const blob = new Blob([colors], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image-colors.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllColors = () => {
    setExtractedColors([]);
    setImageUrl('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImageOnly = () => {
    setImageUrl('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setExtractedColors((prev) => prev.filter((c) => c.source !== 'image'));
  };

  const createTestImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.2, '#4ECDC4');
    gradient.addColorStop(0.4, '#45B7D1');
    gradient.addColorStop(0.6, '#96CEB4');
    gradient.addColorStop(0.8, '#FFEAA7');
    gradient.addColorStop(1, '#DDA0DD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    const testImageUrl = canvas.toDataURL();
    setImageUrl(testImageUrl);
    setSelectedImage(null);
    extractColorsFromImage(testImageUrl);
  };

  const hasImage = Boolean(imageUrl);
  const hasPalette = extractedColors.length > 0;

  return (
    <div className="font-body min-h-[70vh] px-4 py-8 text-zinc-900 sm:py-10 md:px-6 dark:text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/25 to-violet-500/20 blur-3xl dark:from-cyan-500/15 dark:to-fuchsia-600/10" />
        <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-tr from-violet-400/20 to-pink-400/15 blur-3xl dark:from-violet-600/10 dark:to-pink-500/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between" data-aos="fade-down">
          <div className="max-w-2xl">
            <p className="font-code text-[11px] font-medium uppercase tracking-[0.28em] text-sky-600 dark:text-cyan-300/90">
              Tools
            </p>
            <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Image color picker
            </h1>
            <p className="font-body mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              Upload a reference, get dominant swatches, then copy hex or add picks from your screen.
            </p>
          </div>
          <Link
            to="/eye-dropper"
            className="font-ui inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-zinc-200/90 bg-white/80 px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur transition hover:border-violet-300 hover:text-violet-800 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:border-cyan-400/40 dark:hover:text-cyan-100"
          >
            <FaEyeDropper className="text-violet-600 dark:text-cyan-300" aria-hidden />
            Full-screen eyedropper
            <HiArrowTopRightOnSquare className="h-4 w-4 opacity-70" aria-hidden />
          </Link>
        </header>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {/* Toolbar */}
        <div
          className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3"
          data-aos="fade-up"
        >
          <button
            type="button"
            onClick={createTestImage}
            className="font-ui rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Try sample image
          </button>
          {isSupported && (
            <button
              type="button"
              onClick={startColorPicking}
              disabled={isPicking}
              className={`font-ui inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition ${
                isPicking
                  ? 'cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                  : 'bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:brightness-110'
              }`}
            >
              <FaEyeDropper aria-hidden />
              {isPicking ? 'Picking…' : 'Pick from screen'}
            </button>
          )}
          {hasPalette && (
            <>
              <button
                type="button"
                onClick={downloadPalette}
                className="font-ui inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800/80"
              >
                <FaDownload aria-hidden />
                Download .txt
              </button>
              <button
                type="button"
                onClick={clearAllColors}
                className="font-ui rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
              >
                Clear all
              </button>
            </>
          )}
        </div>
        {!isSupported && (
          <p className="mb-6 text-center text-sm text-zinc-500 sm:text-left dark:text-zinc-400">
            Screen picking is not available in this browser. Use Chrome, Edge, or Firefox.
          </p>
        )}

        {!hasImage ? (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerFileInput();
              }
            }}
            className={`mx-auto max-w-2xl cursor-pointer rounded-[1.35rem] border-2 border-dashed p-10 text-center transition sm:p-12 ${
              dragActive
                ? 'scale-[1.01] border-sky-500 bg-sky-50/80 dark:border-cyan-400 dark:bg-cyan-950/30'
                : 'border-zinc-300 bg-white/70 shadow-inner backdrop-blur-xl hover:border-violet-400 dark:border-white/15 dark:bg-white/[0.06] dark:hover:border-cyan-400/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            data-aos="fade-up"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 text-white shadow-lg sm:h-20 sm:w-20">
              <HiPhoto className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-white">
              Drop an image here
            </h2>
            <p className="font-body mt-2 text-sm text-zinc-600 dark:text-zinc-400">or click to browse — JPG, PNG, GIF, WebP up to 10MB</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10" data-aos="fade-up">
            {/* Preview column */}
            <div className="lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-[1.35rem] border border-zinc-200/90 bg-white/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
                <div className="relative flex max-h-[min(56vh,480px)] min-h-[220px] items-center justify-center bg-zinc-100/90 dark:bg-zinc-950/60">
                  <img src={imageUrl} alt="Uploaded reference" className="max-h-[min(56vh,480px)] w-full object-contain p-3" />
                </div>
                <div className="flex flex-wrap gap-2 border-t border-zinc-200/80 p-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="font-ui inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 sm:flex-none"
                  >
                    <HiPhoto className="h-5 w-5" aria-hidden />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => extractColorsFromImage(imageUrl)}
                    disabled={isLoading}
                    className="font-ui inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:flex-none"
                  >
                    <HiArrowPath className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden />
                    Re-extract
                  </button>
                  <button
                    type="button"
                    onClick={removeImageOnly}
                    className="font-ui inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300 sm:flex-none"
                  >
                    <HiTrash className="h-5 w-5" aria-hidden />
                    Remove
                  </button>
                </div>
              </div>
              {selectedImage?.name && (
                <p className="font-code mt-3 truncate text-center text-xs text-zinc-500 dark:text-zinc-400 lg:text-left">
                  {selectedImage.name}
                </p>
              )}
            </div>

            {/* Palette column */}
            <div className="min-w-0 space-y-6">
              {isLoading && (
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/70 py-10 dark:border-white/10 dark:bg-zinc-900/40">
                  <div className="relative h-11 w-11">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-200 dark:border-violet-900" />
                    <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-600 dark:border-t-cyan-400" />
                  </div>
                  <div>
                    <p className="font-ui font-semibold text-zinc-900 dark:text-white">Extracting colors</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Sampling your image…</p>
                  </div>
                </div>
              )}

              {!isLoading && !hasPalette && (
                <p className="rounded-2xl border border-dashed border-zinc-200/90 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-600 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-400">
                  No swatches yet. If extraction failed, try another image or use <strong>Pick from screen</strong>.
                </p>
              )}

              {!isLoading && hasPalette && (
                <>
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
                      Palette
                    </h2>
                    <p className="font-body mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {extractedColors.length} colors — click a swatch to copy hex
                    </p>
                  </div>
                  <div className="flex justify-center sm:justify-start">
                    <CardListSlider viewMode={viewMode} setViewMode={setViewMode} />
                  </div>

                  {viewMode === 'cards' ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {extractedColors.map((color, index) => (
                        <div
                          key={color.id ?? `${color.hex}-${index}`}
                          className="group overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/60"
                        >
                        <div className="relative">
                          <div
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                copyToClipboard(color.hex, `hex-${color.id ?? index}`);
                              }
                            }}
                            className="relative flex h-28 w-full cursor-pointer items-center justify-center transition group-hover:brightness-[1.02]"
                            style={{ backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}
                            onClick={() => copyToClipboard(color.hex, `hex-${color.id ?? index}`)}
                          >
                            <span className="pointer-events-none rounded-full bg-black/55 px-2 py-1 font-code text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100">
                              Copy
                            </span>
                            {copiedColor === `hex-${color.id ?? index}` && (
                              <span className="pointer-events-none absolute flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-zinc-900 shadow">
                                <FaCheck className="text-emerald-600" aria-hidden />
                                Copied
                              </span>
                            )}
                            {color.source && (
                              <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 font-code text-[10px] font-medium uppercase tracking-wide text-white/95">
                                {color.source === 'eyedropper' ? 'Screen' : 'Image'}
                              </span>
                            )}
                          </div>
                          <div className="pointer-events-none absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(color.hex, `hex-${color.id ?? index}`);
                              }}
                              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/50"
                              title="Copy"
                            >
                              <FaCopy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(color);
                              }}
                              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm hover:bg-black/50"
                              title="Favorite"
                            >
                              {favorites.find((f) => f.hex === color.hex) ? (
                                <FaHeart className="h-3.5 w-3.5 text-red-400" />
                              ) : (
                                <FaRegHeart className="h-3.5 w-3.5 text-white" />
                              )}
                            </button>
                          </div>
                        </div>
                          <div className="space-y-2 p-3">
                            {color.name && <p className="font-ui text-xs font-medium text-zinc-500 dark:text-zinc-400">{color.name}</p>}
                            <p className="font-code text-sm font-semibold text-zinc-900 dark:text-zinc-100">{color.hex}</p>
                            <div className="font-code text-[11px] text-zinc-600 dark:text-zinc-400">
                              <div className="flex justify-between gap-2">
                                <span>RGB</span>
                                <span>
                                  {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span>HSL</span>
                                <span>
                                  {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 shadow-md dark:border-white/10 dark:bg-zinc-900/60">
                      <ul className="divide-y divide-zinc-200/80 dark:divide-white/10">
                        {extractedColors.map((color, index) => (
                          <li key={color.id ?? `${color.hex}-${index}`}>
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-white/5"
                              onClick={() => copyToClipboard(color.hex, `hex-${color.id ?? index}`)}
                            >
                              <span
                                className="h-10 w-10 shrink-0 rounded-xl border border-zinc-200/80 shadow-inner dark:border-white/10"
                                style={{ backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-code text-sm font-semibold text-zinc-900 dark:text-zinc-100">{color.hex}</p>
                                <p className="font-code text-xs text-zinc-500 dark:text-zinc-400">
                                  RGB {color.rgb.r},{color.rgb.g},{color.rgb.b} · HSL {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                                </p>
                              </div>
                              {copiedColor === `hex-${color.id ?? index}` ? (
                                <FaCheck className="shrink-0 text-emerald-600" aria-hidden />
                              ) : (
                                <FaCopy className="shrink-0 text-zinc-400" aria-hidden />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Favorites — full width below main */}
        {favorites.length > 0 && (
          <section className="mt-14 border-t border-zinc-200/80 pt-10 dark:border-white/10" data-aos="fade-up">
            <h2 className="font-display text-center text-xl font-semibold text-zinc-900 dark:text-white">Saved favorites</h2>
            <p className="font-body mt-1 text-center text-sm text-zinc-600 dark:text-zinc-400">{favorites.length} colors</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {favorites.map((color, index) => (
                <button
                  key={`fav-${color.hex}-${index}`}
                  type="button"
                  className="group overflow-hidden rounded-2xl border border-zinc-200/90 bg-white text-left shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-zinc-900/60"
                  onClick={() => copyToClipboard(color.hex, `fav-${index}`)}
                >
                  <div className="relative h-16 w-full" style={{ backgroundColor: color.hex }}>
                    {copiedColor === `fav-${index}` && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white">
                        Copied
                      </span>
                    )}
                  </div>
                  <p className="font-code truncate p-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">{color.hex}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        <canvas ref={canvasRef} className="hidden" aria-hidden />
      </div>
    </div>
  );
}

export default ImageColorPicker;
