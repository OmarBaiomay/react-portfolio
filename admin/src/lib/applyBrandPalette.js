/** Relative luminance (sRGB), WCAG 2.x */
function channelLum(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * channelLum(r) + 0.7152 * channelLum(g) + 0.0722 * channelLum(b);
}

function contrastRatio(fg, bg) {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(value) {
  if (!value || typeof value !== 'string') return null;
  const parts = value.trim().split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  return parts.slice(0, 3).map((n) => Math.max(0, Math.min(255, Math.round(n))));
}

function formatRgb([r, g, b]) {
  return `${r} ${g} ${b}`;
}

function mixToward(rgb, target, t) {
  return rgb.map((c, i) => Math.round(c + (target[i] - c) * t));
}

export function buttonColorsFromAccent(accentRgbString) {
  const accent = parseRgb(accentRgbString) || [255, 92, 26];
  const white = [255, 255, 255];
  const black = [10, 10, 10];

  if (contrastRatio(white, accent) >= 4.5) {
    return { btn: formatRgb(accent), on: formatRgb(white) };
  }

  let bg = accent;
  for (let i = 0; i < 24; i += 1) {
    bg = mixToward(bg, black, 0.08);
    if (contrastRatio(white, bg) >= 4.5) {
      return { btn: formatRgb(bg), on: formatRgb(white) };
    }
  }

  bg = accent;
  for (let i = 0; i < 24; i += 1) {
    bg = mixToward(bg, white, 0.1);
    if (contrastRatio(black, bg) >= 4.5) {
      return { btn: formatRgb(bg), on: formatRgb(black) };
    }
  }

  return { btn: '146 64 14', on: '255 255 255' };
}

export function applyBrandPalette(palette, mode = 'dark') {
  if (typeof document === 'undefined' || !palette) return;
  const tones = mode === 'light' ? palette.light : palette.dark;
  const accent = tones?.accent || palette.dark?.accent || '255 92 26';
  const { btn, on } = buttonColorsFromAccent(accent);

  const root = document.documentElement;
  root.style.setProperty('--c-accent', accent);
  root.style.setProperty('--c-accent-soft', accent);
  root.style.setProperty('--c-accent-btn', btn);
  root.style.setProperty('--c-on-accent', on);
  root.setAttribute('data-palette', palette.id || 'orange');
}
