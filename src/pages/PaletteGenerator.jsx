// @ts-nocheck — tinycolor + clipboard; plain JSX page.
import { useState, useMemo, useCallback, useEffect } from 'react';
import CardListSlider from '../components/CardListSlider';
import { FaEye } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

/** Number of 5-color groups shown (24 × 5 = 120 swatches). */
const PALETTE_GROUP_COUNT = 24;

/** WCAG-style contrast ratio (tinycolor). */
function ratio(a, b) {
  return tinycolor.readability(tinycolor(a).toHexString(), tinycolor(b).toHexString());
}

function wrapHue(h) {
  return ((h % 360) + 360) % 360;
}

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randFloat(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Darken or lighten `fg` until contrast vs `bg` >= `minRatio` (for text on canvas).
 */
function tuneTextOnBackground(fgHex, bgHex, minRatio = 4.5) {
  let c = tinycolor(fgHex);
  const bg = tinycolor(bgHex);
  const bgLight = bg.isLight();
  for (let i = 0; i < 42; i++) {
    if (ratio(c, bg) >= minRatio) return c.toHexString();
    c = bgLight ? c.darken(2) : c.lighten(2);
  }
  return (bgLight ? tinycolor('#09090b') : tinycolor('#fafafa')).toHexString();
}

/**
 * Darken / slightly desaturate accent until white (#fff) on accent meets `minRatio` (buttons, links on filled).
 */
function tuneAccentForWhiteOnFill(accentHex, minRatio = 4.5) {
  let c = tinycolor(accentHex);
  for (let i = 0; i < 45; i++) {
    if (ratio('#ffffff', c) >= minRatio) return c.toHexString();
    c = c.darken(2);
    if (i % 5 === 4) c = c.desaturate(3);
  }
  return c.toHexString();
}

function hslHex(h, sPct, lPct) {
  return tinycolor(`hsl(${Math.round(wrapHue(h))}, ${Math.min(100, Math.max(0, sPct))}%, ${Math.min(100, Math.max(0, lPct))}%)`).toHexString();
}

/** Separate canvas and card surfaces (real apps rarely use pure #fff only). */
function liftSurfaceAboveCanvas(canvasHex, brandH, persona) {
  const base = tinycolor(canvasHex);
  const hsl = base.toHsl();
  const h = Number.isFinite(hsl.h) ? wrapHue(hsl.h + randInt(-6, 6)) : wrapHue(brandH);
  const sBump = persona === 'marketing' ? randInt(10, 22) : persona === 'saas' ? randInt(6, 14) : randInt(4, 12);
  const targetL = Math.max(82, Math.min(94, (hsl.l ?? 0.97) * 100 - randFloat(3.5, 8)));
  return hslHex(h, sBump, targetL);
}

/**
 * One real-world–biased UI palette (hex), slot order matches preview:
 * [0] primary text on canvas, [1] brand / CTA fill (white label safe),
 * [2] secondary / muted text on canvas, [3] raised surface / band behind content, [4] app canvas background.
 */
function generateHarmoniousGroup() {
  /** saas = conservative chroma; product = default; marketing = braver backgrounds */
  const personaRoll = Math.random();
  const persona = personaRoll < 0.38 ? 'saas' : personaRoll < 0.78 ? 'product' : 'marketing';

  const brandH = Math.random() * 360;
  const bgHue = wrapHue(brandH + randInt(-14, 14));
  const bgSat =
    persona === 'saas' ? randInt(3, 9) : persona === 'product' ? randInt(5, 13) : randInt(8, 18);
  const c4 = hslHex(bgHue, bgSat, randInt(96, 99));

  const textHue = wrapHue(brandH + randInt(-22, 22));
  const textSat = persona === 'saas' ? randInt(5, 11) : randInt(6, 16);
  let c0 = hslHex(textHue, textSat, randInt(11, 17));
  c0 = tuneTextOnBackground(c0, c4, 4.52);

  const mutedHue = wrapHue(brandH + randInt(-35, 35));
  const mutedSat = randInt(9, 26);
  let c2 = hslHex(mutedHue, mutedSat, randInt(43, 54));
  c2 = tuneTextOnBackground(c2, c4, 3.65);

  const accentStrategy = Math.random();
  let accentHue = brandH;
  if (accentStrategy < 0.12) accentHue = wrapHue(brandH + 180 + randInt(-18, 18));
  else if (accentStrategy < 0.35) accentHue = wrapHue(brandH + randInt(-28, 28));
  else if (accentStrategy < 0.55) accentHue = wrapHue(brandH + 150 + randInt(-12, 12));
  else accentHue = wrapHue(brandH + randInt(-14, 14));

  const accentSat =
    persona === 'saas' ? randInt(46, 62) : persona === 'product' ? randInt(52, 72) : randInt(56, 82);
  let accentL = persona === 'saas' ? randInt(40, 48) : persona === 'product' ? randInt(42, 52) : randInt(44, 54);
  let c1 = hslHex(accentHue, accentSat, accentL);
  c1 = tuneAccentForWhiteOnFill(c1, 4.52);

  let c3 = liftSurfaceAboveCanvas(c4, brandH, persona);
  if (ratio(c3, c4) < 1.06) {
    c3 = tinycolor(c4).darken(4).toHexString();
  }
  if (ratio(c0, c3) < 3.2) {
    c0 = tuneTextOnBackground(c0, c3, 3.25);
  }

  return [c0, c1, c2, c3, c4];
}

function buildAllGroups() {
  return Array.from({ length: PALETTE_GROUP_COUNT }, () => generateHarmoniousGroup()).flat();
}

function colorToRgbLabel(hex) {
  const t = tinycolor(hex);
  if (!t.isValid()) return '';
  const { r, g, b } = t.toRgb();
  return `rgb(${r}, ${g}, ${b})`;
}

function PaletteGenerator() {
  const [colors, setColors] = useState(() => buildAllGroups());
  const [openGroupIdx, setOpenGroupIdx] = useState(null);
  const [viewMode, setViewMode] = useState('cards');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPaletteForPreview, setSelectedPaletteForPreview] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const groupedColors = useMemo(() => {
    const groups = [];
    for (let i = 0; i < colors.length; i += 5) {
      groups.push(colors.slice(i, i + 5));
    }
    return groups;
  }, [colors]);

  const generateNewPalette = useCallback(() => {
    setColors(buildAllGroups());
    setOpenGroupIdx(null);
    setCopyFeedback(null);
  }, []);

  const copyToClipboard = useCallback(async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopyFeedback(hex);
      setTimeout(() => setCopyFeedback((cur) => (cur === hex ? null : cur)), 1800);
    } catch {
      window.alert('Could not copy — check browser permissions.');
    }
  }, []);

  const copyAllHex = useCallback(async (group) => {
    const text = group.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`all:${group[0]}`);
      setTimeout(() => setCopyFeedback((cur) => (cur === `all:${group[0]}` ? null : cur)), 1800);
    } catch {
      window.alert('Could not copy — check browser permissions.');
    }
  }, []);

  const openPreviewInNewTab = (paletteIndex) => {
    const palette = groupedColors[paletteIndex];
    if (!palette?.length) return;
    const previewData = {
      palette: {
        name: `Generated palette ${paletteIndex + 1}`,
        colors: palette,
      },
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem('website-preview-data', JSON.stringify(previewData));
      window.open('/website-preview-full', '_blank');
    } catch {
      window.alert('Could not save preview data.');
    }
  };

  const showPalettePreview = (paletteIndex) => {
    setSelectedPaletteForPreview(paletteIndex);
    setShowPreview(true);
  };

  useEffect(() => {
    if (openGroupIdx === null) return;
    const close = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('[data-palette-card]')) return;
      setOpenGroupIdx(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openGroupIdx]);

  const contrastOn = (bg) => (tinycolor(bg).isLight() ? '#0f172a' : '#f8fafc');

  return (
    <div className="font-body relative flex w-full flex-col items-center overflow-visible px-4 py-8 text-zinc-900 dark:text-zinc-100">
      <h1 className="font-display mb-2 bg-gradient-to-r from-sky-600 via-violet-600 to-fuchsia-500 bg-clip-text text-center text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl">
        Color palette generator
      </h1>
      <p className="font-body mb-6 max-w-2xl text-center text-sm text-zinc-600 dark:text-zinc-400">
        Each set is tuned like a small design system: <strong className="font-medium text-zinc-800 dark:text-zinc-200">canvas</strong>,{' '}
        <strong className="font-medium text-zinc-800 dark:text-zinc-200">raised surface</strong>,{' '}
        <strong className="font-medium text-zinc-800 dark:text-zinc-200">primary and muted text</strong> on canvas, and a{' '}
        <strong className="font-medium text-zinc-800 dark:text-zinc-200">CTA accent</strong> checked for white-on-fill contrast.
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={generateNewPalette}
          className="font-ui inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Regenerate all
        </button>
        <button
          type="button"
          onClick={() => openPreviewInNewTab(selectedPaletteForPreview)}
          className="font-ui hidden rounded-2xl border border-zinc-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 sm:inline-flex dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Open current in full preview
        </button>
      </div>

      {copyFeedback && (
        <p className="font-ui mb-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400" role="status">
          Copied to clipboard
        </p>
      )}

      <CardListSlider viewMode={viewMode} setViewMode={setViewMode} className="mb-8" />

      <style>
        {`
          @keyframes paletteFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .palette-fade-in { animation: paletteFadeIn 0.45s ease-out; }
        `}
      </style>

      {viewMode === 'cards' ? (
        <div
          className={`relative z-0 flex w-full max-w-[100vw] flex-wrap justify-center gap-6 overflow-visible md:gap-8 ${
            openGroupIdx !== null ? 'pb-[min(42vh,24rem)]' : ''
          }`}
        >
          {groupedColors.map((group, index) => (
            <div
              key={`g-${index}-${group[0]}`}
              data-palette-card
              className={`relative flex flex-col items-center rounded-xl border border-zinc-200/90 bg-white/60 p-1 shadow-md backdrop-blur-sm transition-[box-shadow,z-index] dark:border-white/10 dark:bg-zinc-900/40 ${
                openGroupIdx === index
                  ? 'z-[200] shadow-2xl ring-2 ring-violet-400/40 dark:ring-cyan-400/35'
                  : 'z-0'
              }`}
            >
              <button
                type="button"
                data-palette-card-trigger
                className="flex overflow-hidden rounded-lg ring-1 ring-zinc-200/80 transition hover:ring-violet-400/60 dark:ring-white/10 dark:hover:ring-cyan-400/40"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenGroupIdx(openGroupIdx === index ? null : index);
                }}
                aria-expanded={openGroupIdx === index}
                aria-label={`Palette ${index + 1}, open details`}
              >
                {group.map((hex, idx) => (
                  <div
                    key={`${hex}-${idx}`}
                    className="h-14 w-14 shrink-0 transition-all duration-200 hover:w-16 sm:h-16 sm:w-16 sm:hover:w-[4.25rem]"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                ))}
              </button>

              {openGroupIdx === index && (
                <div
                  data-palette-popover
                  className="palette-fade-in absolute left-1/2 top-[calc(100%+0.5rem)] z-[210] w-[min(calc(100vw-2rem),22rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-zinc-200/90 bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-900 dark:ring-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="font-ui text-sm font-semibold text-zinc-900 dark:text-white">Palette #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenGroupIdx(null)}
                      className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                  <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
                    {group.map((hex, idx) => (
                      <li key={`${hex}-row-${idx}`} className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/80">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="h-8 w-8 shrink-0 rounded border border-zinc-200 dark:border-white/10" style={{ backgroundColor: hex }} />
                          <span className="font-code text-xs text-zinc-800 dark:text-zinc-200">{hex}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(hex)}
                          className="font-ui shrink-0 rounded-lg border border-sky-500/40 bg-white px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50 dark:bg-zinc-900 dark:text-cyan-300 dark:hover:bg-zinc-800"
                        >
                          Copy
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => copyAllHex(group)}
                      className="font-ui w-full rounded-lg bg-violet-600 py-2 text-sm font-semibold text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-400"
                    >
                      Copy all (hex list)
                    </button>
                    <button
                      type="button"
                      onClick={() => showPalettePreview(index)}
                      className="font-ui w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/5"
                    >
                      Preview layout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/80 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/50">
            <div className="divide-y divide-zinc-200 dark:divide-white/10">
              {groupedColors.map((group, index) => (
                <div
                  key={`list-${index}-${group[0]}`}
                  className="p-5 transition hover:bg-zinc-50/80 dark:hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                      onClick={() => setOpenGroupIdx(openGroupIdx === index ? null : index)}
                    >
                      <div className="flex -space-x-2">
                        {group.map((hex, idx) => (
                          <div
                            key={`dot-${hex}-${idx}`}
                            className="h-11 w-11 rounded-full border-2 border-white shadow-md dark:border-zinc-900"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                      <div>
                        <span className="font-ui text-sm font-medium text-zinc-800 dark:text-zinc-200">Palette #{index + 1}</span>
                        <p className="font-code text-xs text-zinc-500 dark:text-zinc-400">{group.length} colors</p>
                      </div>
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => showPalettePreview(index)}
                        className="font-ui inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-white px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
                      >
                        <FaEye className="h-4 w-4" aria-hidden />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => copyAllHex(group)}
                        className="font-ui inline-flex items-center gap-2 rounded-full border border-sky-500/50 bg-white px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50 dark:bg-zinc-900 dark:text-sky-300 dark:hover:bg-sky-950/30"
                      >
                        Copy all
                      </button>
                      <button
                        type="button"
                        onClick={() => openPreviewInNewTab(index)}
                        className="font-ui hidden rounded-full border border-violet-500/50 px-3 py-2 text-sm font-medium text-violet-800 hover:bg-violet-50 sm:inline-flex dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-violet-950/30"
                      >
                        Full page
                      </button>
                    </div>
                  </div>

                  {openGroupIdx === index && (
                    <div className="palette-fade-in mt-4 space-y-2 border-t border-zinc-200 pt-4 dark:border-white/10">
                      {group.map((hex, idx) => (
                        <div
                          key={`exp-${hex}-${idx}`}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-zinc-50/90 p-3 transition hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800"
                          onClick={() => copyToClipboard(hex)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              copyToClipboard(hex);
                            }
                          }}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 shadow dark:border-white/10" style={{ backgroundColor: hex }} />
                            <div className="min-w-0">
                              <p className="font-code text-sm font-semibold text-zinc-900 dark:text-zinc-100">{hex}</p>
                              <p className="font-code text-xs text-zinc-500 dark:text-zinc-400">{colorToRgbLabel(hex)}</p>
                            </div>
                          </div>
                          <span className="font-ui shrink-0 text-xs font-medium text-sky-600 dark:text-cyan-400">Copy</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-white/10">
              <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-white">
                Preview — palette {selectedPaletteForPreview + 1}
              </h3>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/10"
                aria-label="Close preview"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-4 sm:p-6">
              <div
                className="rounded-xl border border-zinc-200/80 p-6 sm:p-8 dark:border-white/10"
                style={{ backgroundColor: groupedColors[selectedPaletteForPreview]?.[4] || '#f4f4f5' }}
              >
                <header className="mb-8">
                  <nav className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div
                      className="font-display text-xl font-bold sm:text-2xl"
                      style={{ color: groupedColors[selectedPaletteForPreview]?.[0] || '#18181b' }}
                    >
                      BrandName
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {['Home', 'About', 'Services', 'Contact'].map((item, i) => (
                        <span
                          key={item}
                          className="font-ui text-sm font-medium underline-offset-4 hover:underline"
                          style={{ color: groupedColors[selectedPaletteForPreview]?.[1] || '#3f3f46' }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </nav>

                  <div className="py-8 text-center">
                    <h2
                      className="font-display mb-3 text-3xl font-bold sm:text-4xl"
                      style={{ color: groupedColors[selectedPaletteForPreview]?.[0] || '#18181b' }}
                    >
                      Welcome
                    </h2>
                    <p
                      className="font-body mx-auto mb-6 max-w-xl text-base"
                      style={{ color: groupedColors[selectedPaletteForPreview]?.[2] || '#52525b' }}
                    >
                      Body copy uses the muted swatch so you can judge real-world contrast.
                    </p>
                    <button
                      type="button"
                      className="font-ui rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-md"
                      style={{ backgroundColor: groupedColors[selectedPaletteForPreview]?.[1] || '#6366f1' }}
                    >
                      Get started
                    </button>
                  </div>
                </header>

                <div className="mb-8 grid gap-4 md:grid-cols-2">
                  {['Feature one', 'Feature two'].map((title) => (
                    <div key={title} className="rounded-xl border border-white/40 bg-white/75 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/30">
                      <h4
                        className="font-ui mb-2 text-lg font-semibold"
                        style={{ color: groupedColors[selectedPaletteForPreview]?.[0] || '#18181b' }}
                      >
                        {title}
                      </h4>
                      <p className="font-body text-sm" style={{ color: groupedColors[selectedPaletteForPreview]?.[2] || '#71717a' }}>
                        Secondary text on a light surface.
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="rounded-xl px-4 py-8 text-center sm:px-8"
                  style={{ backgroundColor: groupedColors[selectedPaletteForPreview]?.[3] || '#a1a1aa' }}
                >
                  <h3
                    className="font-display mb-2 text-2xl font-bold"
                    style={{ color: contrastOn(groupedColors[selectedPaletteForPreview]?.[3]) }}
                  >
                    Ready to start?
                  </h3>
                  <p className="font-body mb-4 text-sm opacity-95" style={{ color: contrastOn(groupedColors[selectedPaletteForPreview]?.[3]) }}>
                    Contrast-aware text on the band color.
                  </p>
                  <button
                    type="button"
                    className="font-ui rounded-lg px-5 py-2 text-sm font-semibold shadow"
                    style={{
                      backgroundColor: groupedColors[selectedPaletteForPreview]?.[0] || '#18181b',
                      color: contrastOn(groupedColors[selectedPaletteForPreview]?.[0] || '#18181b'),
                    }}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 p-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="font-ui rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => openPreviewInNewTab(selectedPaletteForPreview)}
                className="font-ui rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                Open full preview tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaletteGenerator;
