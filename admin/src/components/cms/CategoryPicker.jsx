import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react';
import { blogAPI } from '../../services/api';

const ARABIC = /[؀-ۿ]/;
const norm = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();

/** Searchable category picker; typing a name that does not exist offers to create it inline. */
export default function CategoryPicker({ value, onChange, lang, labels: L }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [draft, setDraft] = useState(null); // { en, ar } while creating
  const [saving, setSaving] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    blogAPI
      .categories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
        setDraft(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const name = (c) => c?.name?.[lang] || c?.name?.en || c?.name?.ar || c?.slug || '';
  const selected = categories.find((c) => c.slug === value);

  const matches = useMemo(() => {
    const q = norm(query);
    return q ? categories.filter((c) => norm(`${c.name?.en} ${c.name?.ar} ${c.slug}`).includes(q)) : categories;
  }, [categories, query]);

  const exact = matches.some((c) => [c.name?.en, c.name?.ar].some((n) => norm(n) === norm(query)));
  const canCreate = query.trim() && !exact;
  const options = [...matches.map((c) => ({ type: 'pick', c })), ...(canCreate ? [{ type: 'create' }] : [])];

  const pick = (c) => {
    onChange(c ? c.slug : '');
    setOpen(false);
    setQuery('');
    setDraft(null);
  };

  const startCreate = () => {
    const text = query.trim();
    setDraft(ARABIC.test(text) ? { en: '', ar: text } : { en: text, ar: '' });
  };

  const create = async () => {
    if (!draft || (!draft.en.trim() && !draft.ar.trim())) return;
    setSaving(true);
    try {
      const { data } = await blogAPI.createCategory(draft);
      setCategories((list) => (list.some((c) => c.slug === data.slug) ? list : [...list, data]));
      toast.success(L.categoryCreated);
      pick(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[active];
      if (!opt) return;
      if (opt.type === 'pick') pick(opt.c);
      else startCreate();
    } else if (e.key === 'Escape') {
      setOpen(false);
      setDraft(null);
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <span className="form-label">{L.category}</span>
      <div
        className={`flex h-11 items-center gap-2 rounded-xl border bg-surface px-3 transition ${
          open ? 'border-accent ring-4 ring-accent/15' : 'border-line/15'
        }`}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selected && !open ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-sm font-semibold text-accent">
            {name(selected)}
          </span>
        ) : null}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            setDraft(null);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={selected && !open ? '' : L.categoryPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          role="combobox"
          aria-expanded={open}
          aria-label={L.category}
        />
        {value ? (
          <button
            type="button"
            className="grid h-6 w-6 place-items-center rounded-full text-muted hover:bg-line/10 hover:text-ink"
            onClick={(e) => {
              e.stopPropagation();
              pick(null);
            }}
            aria-label={L.noCategory}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition ${open ? 'rotate-180 text-accent' : ''}`} />
      </div>
      <p className="mt-1 text-[11px] text-muted">{L.categoryHint}</p>

      {open ? (
        <div className="absolute inset-x-0 top-[4.75rem] z-30 overflow-hidden rounded-xl border border-line/15 bg-elevated shadow-2xl">
          {draft ? (
            <div className="space-y-3 p-3">
              <label className="block">
                <span className="form-label">{L.categoryNameEn}</span>
                <input
                  autoFocus={!draft.en}
                  dir="ltr"
                  value={draft.en}
                  onChange={(e) => setDraft({ ...draft, en: e.target.value })}
                  className="field"
                />
              </label>
              <label className="block">
                <span className="form-label">{L.categoryNameAr}</span>
                <input
                  autoFocus={Boolean(draft.en)}
                  dir="rtl"
                  value={draft.ar}
                  onChange={(e) => setDraft({ ...draft, ar: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), create())}
                  className="field"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => setDraft(null)}>
                  {L.cancel}
                </button>
                <button type="button" className="btn-primary !py-2 text-xs" disabled={saving} onClick={create}>
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  {L.create}
                </button>
              </div>
            </div>
          ) : (
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {options.length ? (
                options.map((opt, i) =>
                  opt.type === 'pick' ? (
                    <li
                      key={opt.c.slug}
                      role="option"
                      aria-selected={opt.c.slug === value}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(opt.c)}
                      className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-sm ${
                        i === active ? 'bg-accent/10 text-accent' : 'text-ink'
                      }`}
                    >
                      <span>
                        {name(opt.c)}
                        <span className="ms-2 text-xs text-muted">
                          {lang === 'ar' ? opt.c.name?.en : opt.c.name?.ar}
                        </span>
                      </span>
                      {opt.c.slug === value ? <Check className="h-4 w-4 text-accent" /> : null}
                    </li>
                  ) : (
                    <li
                      key="create"
                      role="option"
                      aria-selected={false}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={startCreate}
                      className={`flex cursor-pointer items-center gap-2 border-t border-line/10 px-3 py-2.5 text-sm font-semibold ${
                        i === active ? 'bg-accent/10 text-accent' : 'text-accent'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      {L.createCategory.replace('{name}', query.trim())}
                    </li>
                  )
                )
              ) : (
                <li className="px-3 py-3 text-sm text-muted">{L.noCategories}</li>
              )}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
