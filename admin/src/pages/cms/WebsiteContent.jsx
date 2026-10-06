import { useMemo, useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getIn, moveItem, setIn, useContentPart } from '../../lib/cms';
import { BiField, BiStringList, CmsHeader, CmsLoading, RowTools } from '../../components/cms/CmsFields';

/** Managed on their own pages, so not repeated here. */
const SKIP = new Set(['manifesto']);

const humanize = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Blank copy of an object's shape, for "add item". */
function blankLike(sample) {
  if (typeof sample === 'string') return '';
  if (Array.isArray(sample)) return [];
  if (isObj(sample)) return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]));
  return sample;
}

function matches(value, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const walk = (v) =>
    typeof v === 'string' ? v.toLowerCase().includes(q) : Array.isArray(v) ? v.some(walk) : isObj(v) ? Object.values(v).some(walk) : false;
  return walk(value);
}

/** Recursive editor over the English tree, reading Arabic at the same path. */
function Node({ path, label, en, ar, onSet, query, depth = 0 }) {
  const { t } = useLanguage();

  if (typeof en === 'string') {
    if (query && !matches([en, ar], query)) return null;
    const long = (en?.length || 0) > 70 || (ar?.length || 0) > 70;
    return (
      <BiField
        label={label}
        multiline={long}
        rows={long ? 3 : 2}
        value={{ en, ar: typeof ar === 'string' ? ar : '' }}
        onChange={(v) => {
          onSet(['en', ...path], v.en);
          onSet(['ar', ...path], v.ar);
        }}
      />
    );
  }

  if (Array.isArray(en) && en.every((x) => typeof x === 'string')) {
    if (query && !matches([en, ar], query)) return null;
    return (
      <BiStringList
        label={label}
        value={{ en, ar: Array.isArray(ar) ? ar : [] }}
        onChange={(v) => {
          onSet(['en', ...path], v.en);
          onSet(['ar', ...path], v.ar);
        }}
      />
    );
  }

  if (Array.isArray(en)) {
    if (query && !matches([en, ar], query)) return null;
    const arList = Array.isArray(ar) ? ar : [];
    const sample = en[0] || arList[0] || {};
    const setBoth = (nextEn, nextAr) => {
      onSet(['en', ...path], nextEn);
      onSet(['ar', ...path], nextAr);
    };
    return (
      <div className="min-w-0">
        <p className="form-label">{label}</p>
        <div className="space-y-3">
          {en.map((item, i) => (
            <div key={i} className="rounded-xl border border-line/10 bg-bg/40 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted">
                  {t.cms.content.item} {i + 1}
                </span>
                <RowTools
                  onUp={i > 0 ? () => setBoth(moveItem(en, i, -1), moveItem(arList, i, -1)) : null}
                  onDown={i < en.length - 1 ? () => setBoth(moveItem(en, i, 1), moveItem(arList, i, 1)) : null}
                  onDelete={() => setBoth(en.filter((_, j) => j !== i), arList.filter((_, j) => j !== i))}
                />
              </div>
              <div className="space-y-3">
                <Node
                  path={[...path, i]}
                  label={null}
                  en={item}
                  ar={arList[i]}
                  onSet={onSet}
                  depth={depth + 1}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn-ghost !py-2 text-xs"
            onClick={() => setBoth([...en, blankLike(sample)], [...arList, blankLike(sample)])}
          >
            <Plus className="h-3.5 w-3.5" />
            {t.cms.content.addItem}
          </button>
        </div>
      </div>
    );
  }

  if (isObj(en)) {
    const children = Object.entries(en).map(([key, value]) => (
      <Node
        key={key}
        path={[...path, key]}
        label={humanize(key)}
        en={value}
        ar={isObj(ar) ? ar[key] : undefined}
        onSet={onSet}
        query={query}
        depth={depth + 1}
      />
    ));
    if (depth === 0 || !label) return <div className="space-y-5">{children}</div>;
    if (query && !matches([en, ar], query)) return null;
    return (
      <fieldset className="space-y-4 rounded-xl border border-line/10 p-4">
        <legend className="px-1 text-sm font-bold text-ink">{label}</legend>
        {children}
      </fieldset>
    );
  }

  return null;
}

export default function WebsiteContent() {
  const { t } = useLanguage();
  const c = t.cms;
  const part = useContentPart('translations', {
    saved: c.savedToast,
    reset: c.resetToast,
    loadError: c.loadError,
    saveError: c.saveError,
  });
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState('');

  const tr = part.value;
  const sections = useMemo(
    () => (tr ? Object.keys(tr.en).filter((k) => isObj(tr.en[k]) && !SKIP.has(k)) : []),
    [tr]
  );
  const visibleSections = query ? sections.filter((k) => matches([tr.en[k], tr.ar?.[k]], query)) : sections;
  const current = active && sections.includes(active) ? active : visibleSections[0];

  if (!tr) return <CmsLoading />;

  const onSet = (path, val) => part.update((prev) => setIn(prev, path, val));

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <CmsHeader
        title={c.content.title}
        description={c.content.description}
        icon={FileText}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      />

      <div className="grid gap-6 lg:grid-cols-[14rem_1fr]">
        <aside className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <label className="relative mb-3 block">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={c.search}
              className="field !ps-9"
            />
          </label>
          <p className="form-label">{c.content.sections}</p>
          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {visibleSections.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`shrink-0 rounded-lg px-3 py-2 text-start text-sm font-medium transition ${
                  key === current ? 'bg-accent text-white' : 'text-muted hover:bg-surface hover:text-ink'
                }`}
              >
                {humanize(key)}
              </button>
            ))}
          </nav>
        </aside>

        <section className="form-card min-w-0">
          <div className="form-card-header">
            <h2 className="font-display text-lg font-bold text-ink">{current ? humanize(current) : c.empty}</h2>
          </div>
          <div className="form-card-body">
            {current ? (
              <Node
                key={current}
                path={[current]}
                label={humanize(current)}
                en={tr.en[current]}
                ar={getIn(tr, ['ar', current])}
                onSet={onSet}
                query={query}
              />
            ) : (
              <p className="text-muted">{c.empty}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
