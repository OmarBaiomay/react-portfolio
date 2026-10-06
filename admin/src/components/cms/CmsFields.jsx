import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { mediaAPI } from '../../services/api';
import { assetUrl } from '../../lib/cms';
import { useLanguage } from '../../context/LanguageContext';

const LANGS = [
  { code: 'en', dir: 'ltr' },
  { code: 'ar', dir: 'rtl' },
];

/** English + Arabic side by side (stacked on phones). */
export function BiField({ label, hint, value, onChange, multiline = false, rows = 3 }) {
  const { t } = useLanguage();
  const v = value || {};
  return (
    <div className="min-w-0">
      {label ? <p className="form-label">{label}</p> : null}
      <div className="grid gap-2 md:grid-cols-2">
        {LANGS.map(({ code, dir }) => {
          const Tag = multiline ? 'textarea' : 'input';
          return (
            <div key={code} dir={dir} className="relative">
              <span className="pointer-events-none absolute end-2.5 top-2 rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">
                {code === 'en' ? t.cms.en : t.cms.ar}
              </span>
              <Tag
                dir={dir}
                rows={multiline ? rows : undefined}
                value={v[code] ?? ''}
                onChange={(e) => onChange({ ...v, [code]: e.target.value })}
                className="field !pe-12"
              />
            </div>
          );
        })}
      </div>
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}

export function TextField({ label, hint, value, onChange, type = 'text', dir, placeholder, multiline }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="block min-w-0">
      {label ? <span className="form-label">{label}</span> : null}
      <Tag
        type={multiline ? undefined : type}
        dir={dir}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
      {hint ? <span className="form-hint block">{hint}</span> : null}
    </label>
  );
}

/** Editable list of short strings (one input per item). */
export function StringList({ label, value, onChange, dir, addLabel }) {
  const { t } = useLanguage();
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="min-w-0">
      {label ? <p className="form-label">{label}</p> : null}
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              dir={dir}
              value={item}
              onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
              className="field"
            />
            <button
              type="button"
              className="icon-btn shrink-0"
              aria-label={t.common.delete}
              onClick={() => onChange(list.filter((_, j) => j !== i))}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...list, ''])}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel || t.cms.add}
        </button>
      </div>
    </div>
  );
}

/** { en: [...], ar: [...] } string lists, side by side. */
export function BiStringList({ label, value, onChange }) {
  const { t } = useLanguage();
  const v = value || {};
  return (
    <div className="min-w-0">
      {label ? <p className="form-label">{label}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {LANGS.map(({ code, dir }) => (
          <div key={code} className="rounded-xl border border-line/10 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase text-muted">{code === 'en' ? t.cms.en : t.cms.ar}</p>
            <StringList dir={dir} value={v[code]} onChange={(list) => onChange({ ...v, [code]: list })} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Upload an image to /api/media, or paste a URL. Shows a preview. */
export function ImageField({ label, hint, value, onChange, aspect = 'aspect-video' }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error(t.cms.tooBig);
      return;
    }
    setBusy(true);
    try {
      const { data } = await mediaAPI.upload(file);
      onChange(data.url);
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.uploadFail);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="min-w-0">
      {label ? <p className="form-label">{label}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`group relative grid w-full shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-line/20 bg-surface sm:w-48 ${aspect}`}
        >
          {value ? (
            <img src={assetUrl(value)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : null}
          <span
            className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
              value ? 'bg-black/60 text-white opacity-0 transition group-hover:opacity-100' : 'text-muted'
            }`}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {busy ? t.cms.uploading : value ? t.cms.replace : t.cms.upload}
          </span>
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            dir="ltr"
            value={value || ''}
            placeholder="/api/media/… or https://…"
            onChange={(e) => onChange(e.target.value)}
            className="field font-mono text-xs"
          />
          {value ? (
            <button type="button" className="btn-ghost !py-1.5 text-xs" onClick={() => onChange('')}>
              <Trash2 className="h-3.5 w-3.5" />
              {t.cms.removeImage}
            </button>
          ) : null}
          {hint ? <p className="form-hint">{hint}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}

/** Up / down / delete buttons for list rows. */
export function RowTools({ onUp, onDown, onDelete, children, className = '' }) {
  const { t } = useLanguage();
  return (
    <div className={`flex shrink-0 items-center gap-1 ${className}`}>
      {children}
      <button type="button" className="icon-btn disabled:opacity-30" onClick={onUp} disabled={!onUp} aria-label={t.cms.moveUp}>
        <ArrowUp className="h-4 w-4" />
      </button>
      <button type="button" className="icon-btn disabled:opacity-30" onClick={onDown} disabled={!onDown} aria-label={t.cms.moveDown}>
        <ArrowDown className="h-4 w-4" />
      </button>
      {onDelete ? (
        <button
          type="button"
          className="icon-btn hover:!border-red-500/50 hover:!text-red-500"
          onClick={onDelete}
          aria-label={t.common.delete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

/** Page header with Save / Restore defaults; sticks to the top while editing. */
export function CmsHeader({ title, description, icon: Icon, dirty, saving, edited, onSave, onReset, children }) {
  const { t } = useLanguage();
  const confirmReset = () => {
    if (window.confirm(t.cms.resetConfirm)) onReset();
  };
  return (
    <div className="sticky top-0 z-20 -mx-1 mb-6 border-b border-line/10 bg-bg/90 px-1 pb-4 pt-1 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {Icon ? (
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Icon className="h-3.5 w-3.5" />
              {t.nav.groups?.content || t.cms.website}
            </p>
          ) : null}
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {onReset && edited ? (
            <button type="button" className="btn-ghost" onClick={confirmReset} disabled={saving}>
              <RotateCcw className="h-4 w-4" />
              {t.cms.reset}
            </button>
          ) : null}
          {onSave ? (
            <button type="button" className="btn-primary" onClick={() => onSave()} disabled={saving || !dirty}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {dirty ? t.cms.save : t.cms.saved}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CmsLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}
