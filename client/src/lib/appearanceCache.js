const APPEARANCE_KEY = 'bcode-appearance';
const HERO_RANDOM_KEY = 'bcode-hero-random-pick';

export const FALLBACK_PALETTE = {
  id: 'orange',
  name: { en: 'Sunset Orange', ar: 'برتقالي الغروب' },
  dark: { accent: '255 92 26' },
  light: { accent: '224 74 12' },
  swatch: '#FF5C1A',
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

export function readCachedSceneId() {
  const store = readStore();
  return typeof store?.sceneId === 'string' && store.sceneId ? store.sceneId : null;
}

export function cachePalette(palette, btnColors) {
  if (!palette?.id) return;
  writeStore({
    palette,
    btn: btnColors?.btn,
    on: btnColors?.on,
  });
}

export function cacheSceneId(sceneId) {
  if (!sceneId || typeof sceneId !== 'string') return;
  writeStore({ sceneId });
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

/** Persist a concrete pick when admin setting is "random" so remounts don't swap shapes. */
export function resolveRandomSceneId(order) {
  if (typeof window === 'undefined' || !order?.length) return order?.[0] || 'helix';
  try {
    const existing = sessionStorage.getItem(HERO_RANDOM_KEY);
    if (existing && order.includes(existing)) return existing;
    const pick = order[Math.floor(Math.random() * order.length)];
    sessionStorage.setItem(HERO_RANDOM_KEY, pick);
    return pick;
  } catch {
    return order[Math.floor(Math.random() * order.length)];
  }
}

export function paletteAccentKey(palette, theme) {
  if (!palette) return '';
  const tone = theme === 'light' ? palette.light : palette.dark;
  return `${palette.id || ''}:${tone?.accent || ''}`;
}
