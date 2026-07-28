import { useEffect, useMemo, useState } from 'react';
import { Check, Palette, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useBrand } from '../context/BrandContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { applyBrandPalette } from '../lib/applyBrandPalette';

const Appearance = () => {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const { palette, paletteId, palettes, loading, previewPalette, savePalette, refresh } = useBrand();
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);

  const activeId = selectedId || paletteId;

  const selected = useMemo(
    () => palettes.find((p) => p.id === activeId) || palettes[0],
    [palettes, activeId]
  );

  useEffect(() => {
    return () => {
      applyBrandPalette(palette, theme);
    };
  }, [palette, theme]);

  const onSelect = (next) => {
    setSelectedId(next.id);
    previewPalette(next);
  };

  const onApply = async () => {
    if (!selected?.id) return;
    setSaving(true);
    try {
      await savePalette(selected.id);
      setSelectedId(null);
      toast.success(t.appearance.applied);
      await refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || t.appearance.applyFail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-line/10 bg-bg pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Palette className="h-4 w-4" />
              {t.nav.appearance}
            </p>
            <h1 className="font-display text-3xl font-bold text-ink">{t.appearance.title}</h1>
            <p className="mt-1 max-w-2xl text-muted">{t.appearance.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onApply}
            disabled={saving || selected?.id === paletteId}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {saving ? t.common.loading : t.appearance.apply}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">{t.appearance.previewHint}</p>
        <p className="mt-1 text-sm text-muted">{t.appearance.liveNote}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {palettes.map((item) => {
            const isActive = item.id === paletteId;
            const isSelected = item.id === activeId;
            const name = item.name?.[lang] || item.name?.en || item.id;
            const tagline = item.tagline?.[lang] || item.tagline?.en || '';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`group rounded-2xl border p-4 text-start transition ${
                  isSelected
                    ? 'border-accent shadow-glow'
                    : 'border-line/10 hover:border-accent/40'
                } bg-elevated`}
              >
                <div
                  className="mb-4 h-24 w-full rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${item.swatch} 0%, rgba(0,0,0,0.35) 100%)`,
                  }}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
                    <p className="mt-1 text-xs text-muted">{tagline}</p>
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-1 text-[11px] font-semibold text-accent">
                      <Check className="h-3.5 w-3.5" />
                      {t.appearance.active}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ background: item.swatch }}
                  />
                  <span className="text-xs font-mono text-muted">{item.swatch}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Appearance;
