const APPEARANCE_KEY = 'bcode-appearance';

export const FALLBACK_PALETTE = {
  id: 'kingy-blue',
  name: { en: 'Kingy Blue', ar: 'أزرق ملكي' },
  dark: { accent: '59 130 246' },
  light: { accent: '37 99 235' },
  swatch: '#3B82F6',
};

function readStore() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStore(patch) {
  if (typeof window === 'undefined') return;
  try {
    const prev = readStore() || {};
    localStorage.setItem(APPEARANCE_KEY, JSON.stringify({ ...prev, ...patch, updatedAt: Date.now() }));
  } catch {
    // quota / private mode
  }
}

export function readCachedPalette() {
  const store = readStore();
  const palette = store?.palette;
  if (!palette?.id || !palette?.dark?.accent) return FALLBACK_PALETTE;
  return palette;
}

export function hasCachedAppearance() {
  const store = readStore();
  return Boolean(store?.palette?.id && store?.palette?.dark?.accent);
}

export function cachePalette(palette, btnColors) {
  if (!palette?.id) return;
  writeStore({
    palette,
    btn: btnColors?.btn,
    on: btnColors?.on,
  });
}

export function readCachedManifesto() {
  const store = readStore();
  const manifesto = store?.manifesto;
  if (!manifesto || typeof manifesto !== 'object') return null;
  return manifesto;
}

export function cacheManifesto(manifesto) {
  if (!manifesto || typeof manifesto !== 'object') return;
  writeStore({ manifesto });
}

export function paletteAccentKey(palette, theme) {
  if (!palette) return '';
  const tone = theme === 'light' ? palette.light : palette.dark;
  return `${palette.id || ''}:${tone?.accent || ''}`;
}
