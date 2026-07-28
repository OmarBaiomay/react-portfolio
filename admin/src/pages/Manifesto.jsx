import { useEffect, useState } from 'react';
import { Plus, Trash2, Quote, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const emptyLine = () => ({ en: '', ar: '' });

const ManifestoAdmin = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kicker, setKicker] = useState({ en: '', ar: '' });
  const [lines, setLines] = useState([emptyLine()]);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await settingsAPI.getManifesto();
      setKicker({
        en: data?.kicker?.en || '',
        ar: data?.kicker?.ar || '',
      });
      setLines(
        Array.isArray(data?.lines) && data.lines.length
          ? data.lines.map((line) => ({ en: line.en || '', ar: line.ar || '' }))
          : [emptyLine()]
      );
    } catch (error) {
      toast.error(error.response?.data?.message || t.manifestoAdmin.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLine = (index, lang, value) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [lang]: value } : line))
    );
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (index) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const moveLine = (index, dir) => {
    setLines((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    const cleaned = lines
      .map((line) => ({ en: line.en.trim(), ar: line.ar.trim() }))
      .filter((line) => line.en || line.ar);

    if (!cleaned.length) {
      toast.error(t.manifestoAdmin.needLine);
      return;
    }

    setSaving(true);
    try {
      await settingsAPI.updateManifesto({
        kicker: { en: kicker.en.trim(), ar: kicker.ar.trim() },
        lines: cleaned,
      });
      toast.success(t.manifestoAdmin.saved);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || t.manifestoAdmin.saveFail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <Quote className="h-4 w-4" />
          {t.nav.manifesto}
        </p>
        <h1 className="font-display text-3xl font-bold text-ink">{t.manifestoAdmin.title}</h1>
        <p className="mt-1 text-muted">{t.manifestoAdmin.subtitle}</p>
        <p className="mt-2 text-sm text-muted">{t.manifestoAdmin.glowHint}</p>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="rounded-2xl border border-line/10 bg-elevated p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            {t.manifestoAdmin.kicker}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">EN</label>
              <input
                className="input-field"
                value={kicker.en}
                onChange={(e) => setKicker((p) => ({ ...p, en: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">AR</label>
              <input
                className="input-field"
                dir="rtl"
                value={kicker.ar}
                onChange={(e) => setKicker((p) => ({ ...p, ar: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              {t.manifestoAdmin.lines} ({lines.length})
            </h2>
            <button type="button" onClick={addLine} className="btn-ghost !py-2 text-sm">
              <Plus className="h-4 w-4" />
              {t.manifestoAdmin.addLine}
            </button>
          </div>

          {lines.map((line, index) => (
            <div
              key={`line-${index}`}
              className="rounded-2xl border border-line/10 bg-elevated p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  #{index + 1}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveLine(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveLine(index, 1)}
                    disabled={index === lines.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeLine(index)}
                    disabled={lines.length <= 1}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">EN</label>
                  <textarea
                    className="input-field min-h-[72px]"
                    value={line.en}
                    onChange={(e) => updateLine(index, 'en', e.target.value)}
                    placeholder='e.g. Build once, **scale** with confidence'
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">AR</label>
                  <textarea
                    className="input-field min-h-[72px]"
                    dir="rtl"
                    value={line.ar}
                    onChange={(e) => updateLine(index, 'ar', e.target.value)}
                    placeholder="مثال: ابنِ مرة، و**توسّع** بثقة"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? t.common.loading : t.common.save}
        </button>
      </form>
    </div>
  );
};

export default ManifestoAdmin;
