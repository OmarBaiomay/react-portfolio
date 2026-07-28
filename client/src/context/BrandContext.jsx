import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { applyBrandPalette, buttonColorsFromAccent } from '../lib/applyBrandPalette';
import {
  FALLBACK_PALETTE,
  cachePalette,
  paletteAccentKey,
  readCachedPalette,
} from '../lib/appearanceCache';
import { getBootstrappedTheme } from '../lib/bootstrapAppearance';
import { publicAPI } from '../services/frontendApi';
import { useTheme } from './ThemeContext';

const BrandContext = createContext(null);

function samePalette(a, b) {
  return (
    a?.id === b?.id &&
    paletteAccentKey(a, 'dark') === paletteAccentKey(b, 'dark') &&
    paletteAccentKey(a, 'light') === paletteAccentKey(b, 'light')
  );
}

export function BrandProvider({ children }) {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(() => readCachedPalette() || FALLBACK_PALETTE);
  const [loading, setLoading] = useState(true);
  const paletteRef = useRef(palette);
  paletteRef.current = palette;

  useEffect(() => {
    const colors = applyBrandPalette(palette, theme);
    cachePalette(palette, colors);
  }, [palette, theme]);

  useEffect(() => {
    let alive = true;
    const applyThemeData = (data) => {
      if (!alive || !data?.palette) return;
      if (!samePalette(data.palette, paletteRef.current)) {
        setPalette(data.palette);
      } else {
        const accent =
          (theme === 'light' ? data.palette.light : data.palette.dark)?.accent ||
          data.palette.dark?.accent;
        cachePalette(data.palette, buttonColorsFromAccent(accent));
      }
    };

    const load = async ({ refresh = false } = {}) => {
      try {
        const data = refresh
          ? (await publicAPI.getTheme()).data
          : await getBootstrappedTheme();
        applyThemeData(data);
      } catch {
        // keep cached / fallback
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    const onFocus = () => load({ refresh: true });
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      alive = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Fetch once on mount; theme changes only re-apply CSS via the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      palette,
      paletteId: palette?.id || 'orange',
      loading,
      accentKey: paletteAccentKey(palette, theme),
    }),
    [palette, loading, theme]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
