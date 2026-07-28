import { publicAPI } from '../services/frontendApi';
import {
  cacheManifesto,
  cachePalette,
  cacheSceneId,
} from './appearanceCache';
import { buttonColorsFromAccent } from './applyBrandPalette';

let inflight = null;

/**
 * Single shared warm-up for theme / hero-scene / manifesto.
 * Safe to call from main + contexts; only one network round-trip runs.
 */
export function bootstrapAppearance() {
  if (inflight) return inflight;

  inflight = Promise.allSettled([
    publicAPI.getTheme().then(({ data }) => {
      if (!data?.palette) return data;
      const theme =
        (typeof localStorage !== 'undefined' && localStorage.getItem('bcode-theme')) || 'dark';
      const accent =
        (theme === 'light' ? data.palette.light : data.palette.dark)?.accent ||
        data.palette.dark?.accent;
      cachePalette(data.palette, buttonColorsFromAccent(accent));
      return data;
    }),
    publicAPI.getHeroScene().then(({ data }) => {
      if (data?.sceneId) cacheSceneId(data.sceneId);
      return data;
    }),
    publicAPI.getManifesto().then(({ data }) => {
      if (data) cacheManifesto(data);
      return data;
    }),
  ]);

  return inflight;
}

export function getBootstrappedTheme() {
  return bootstrapAppearance().then((results) => {
    const themeResult = results[0];
    if (themeResult.status === 'fulfilled') return themeResult.value;
    return null;
  });
}

export function getBootstrappedHeroScene() {
  return bootstrapAppearance().then((results) => {
    const result = results[1];
    if (result.status === 'fulfilled') return result.value;
    return null;
  });
}

export function getBootstrappedManifesto() {
  return bootstrapAppearance().then((results) => {
    const result = results[2];
    if (result.status === 'fulfilled') return result.value;
    return null;
  });
}
