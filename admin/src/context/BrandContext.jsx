import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { settingsAPI } from '../services/api';
import { applyBrandPalette } from '../lib/applyBrandPalette';
import { useTheme } from './ThemeContext';

const BrandContext = createContext(null);

const FALLBACK_PALETTE = {
  id: 'orange',
  name: { en: 'Sunset Orange', ar: 'برتقالي الغروب' },
  dark: { accent: '255 92 26' },
  light: { accent: '224 74 12' },
  swatch: '#FF5C1A',
};

export function BrandProvider({ children }) {
  const { theme } = useTheme();
  const [palette, setPalette] = useState(FALLBACK_PALETTE);
  const [palettes, setPalettes] = useState([FALLBACK_PALETTE]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await settingsAPI.getTheme();
    if (data?.palette) setPalette(data.palette);
    if (Array.isArray(data?.palettes) && data.palettes.length) setPalettes(data.palettes);
    return data;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await refresh();
      } catch {
        // keep fallback
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  useEffect(() => {
    applyBrandPalette(palette, theme);
  }, [palette, theme]);

  const previewPalette = useCallback(
    (nextPalette) => {
      if (!nextPalette) return;
      applyBrandPalette(nextPalette, theme);
    },
    [theme]
  );

  const savePalette = useCallback(
    async (paletteId) => {
      const { data } = await settingsAPI.updateTheme(paletteId);
      if (data?.palette) setPalette(data.palette);
      if (Array.isArray(data?.palettes) && data.palettes.length) setPalettes(data.palettes);
      return data;
    },
    []
  );

  const value = useMemo(
    () => ({
      palette,
      paletteId: palette?.id || 'orange',
      palettes,
      loading,
      refresh,
      previewPalette,
      savePalette,
    }),
    [palette, palettes, loading, refresh, previewPalette, savePalette]
  );

  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error('useBrand must be used within BrandProvider');
  return ctx;
}
