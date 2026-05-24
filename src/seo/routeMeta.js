/**
 * Per-route SEO copy for ColorSuffel (SPA). Used by SeoHead to set title, description, and robots.
 * Keep titles unique and descriptions under ~160 characters when possible.
 */

export const SITE = {
  brand: 'ColorSuffel',
  titleSuffix: 'ColorSuffel',
  defaultDescription:
    'Free color tools for UI work: palette generator, gradients, shade and tint ladders, image color picker, contrast checker, color names, and CSS you can copy.',
  defaultKeywords:
    'color palette generator, gradient generator, hex colors, RGB, HSL, contrast checker, WCAG, color picker, shade and tint, design tools',
};

/** @type {Record<string, { title: string; description: string; keywords?: string; robots?: string }>} */
export const ROUTE_META = {
  '/': {
    title: 'ColorSuffel — palettes, gradients and contrast for UI',
    description:
      'Explore harmonious palettes, build gradients, check contrast, pick colors from images, and copy CSS — light/dark friendly tools for designers and developers.',
    keywords: SITE.defaultKeywords,
  },
  '/gradient': {
    title: 'Gradient generator',
    description: 'Create multi-stop CSS gradients with live preview and copy-ready code for web projects.',
    keywords: 'CSS gradient, linear gradient, color stops, Tailwind gradient',
  },
  '/pallet': {
    title: 'Palette generator',
    description:
      'Generate design-system style five-color UI palettes with readable text, CTA accents, and canvas tones tuned for real interfaces.',
    keywords: 'color palette, UI colors, brand colors, hex palette',
  },
  '/shade': {
    title: 'Shade & tint',
    description: 'Build lightness ladders from a base hue for hover, pressed, and disabled states in components.',
    keywords: 'color shades, tints, color scale, UI states',
  },
  '/likeshades': {
    title: 'Like shades',
    description: 'Explore shade relationships and palette variations for consistent UI color systems.',
    keywords: 'shades, color harmony, palette',
  },
  '/image-picker': {
    title: 'Image color picker',
    description: 'Upload an image to extract dominant swatches, copy hex values, and pick additional colors from your screen.',
    keywords: 'image palette, extract colors from photo, eyedropper',
  },
  '/color-names': {
    title: 'Color names',
    description: 'Look up human-readable color names alongside hex and RGB values for documentation and handoff.',
    keywords: 'color names, hex to name, CSS color keywords',
  },
  '/contrast-checker': {
    title: 'Contrast checker',
    description: 'Check foreground and background pairs for WCAG contrast before you ship accessible interfaces.',
    keywords: 'WCAG contrast, accessibility, color contrast ratio',
  },
  '/color-harmony': {
    title: 'Color harmony',
    description: 'Explore complementary, analogous, and other harmonic relationships around a base color.',
    keywords: 'color harmony, complementary colors, color wheel',
  },
  '/color-blindness': {
    title: 'Color blindness simulator',
    description: 'Preview how your palette may appear with common color-vision deficiencies.',
    keywords: 'color blindness, deuteranopia, protanopia, accessibility',
  },
  '/css-generator': {
    title: 'CSS generator',
    description: 'Generate CSS variables and snippets from your colors for faster front-end handoff.',
    keywords: 'CSS variables, :root colors, design tokens',
  },
  '/eye-dropper': {
    title: 'Eye dropper',
    description: 'Pick colors from anywhere on screen with the browser EyeDropper API where supported.',
    keywords: 'eyedropper, screen color picker, sRGB hex',
  },
  '/brand-generator': {
    title: 'Brand palette generator',
    description: 'Generate cohesive brand-oriented color sets for marketing and product surfaces.',
    keywords: 'brand colors, brand palette',
  },
  '/demo-website': {
    title: 'Demo website',
    description: 'Preview preset palettes on sample marketing blocks to see colors in a realistic layout.',
    keywords: 'palette preview, demo UI',
  },
  '/website-preview': {
    title: 'Website preview',
    description: 'Try palettes against a simple site layout and switch between preset themes.',
    keywords: 'website preview, palette mockup',
  },
  '/website-preview-full': {
    title: 'Full website preview',
    description: 'Full-screen preview of a generated palette applied to a sample page layout.',
    keywords: 'palette preview full screen',
  },
  '/ui-design-guide': {
    title: 'UI design guide',
    description: 'Reference notes and patterns for using color consistently in interface design.',
    keywords: 'UI design, color usage, design guide',
  },
  '/contact': {
    title: 'Contact',
    description: 'Get in touch about ColorSuffel, feedback, or collaborations.',
    keywords: 'contact, ColorSuffel',
  },
};

/**
 * @param {string} pathname
 * @returns {{ title: string; description: string; keywords?: string; robots?: string; path: string }}
 */
export function getRouteMeta(pathname) {
  const path = pathname.split('?')[0] || '/';
  const entry = ROUTE_META[path];
  if (entry) {
    return { ...entry, path };
  }
  return {
    title: 'Page not found',
    description: 'This URL is not part of ColorSuffel. Use the navigation to explore color tools.',
    robots: 'noindex, nofollow',
    path,
  };
}
