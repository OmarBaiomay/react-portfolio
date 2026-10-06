import { useState } from 'react';
import { ArrowLeft, ExternalLink, Eye, EyeOff, FileText, Pencil, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_URL, moveItem, slugify, useContentPart } from '../../lib/cms';
import { BiField, CmsHeader, CmsLoading, RowTools, TextField } from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';
import { MarkdownEditor } from './Blog';

/** Slugs the website already uses for other routes. */
const RESERVED = new Set(['blog', 'work', 'api', 'admin', 'images', 'sitemap-xml', 'robots-txt', 'llms-txt']);

const today = () => new Date().toISOString().slice(0, 10);

const newPage = (n) => ({
  slug: `new-page-${n}`,
  footer: true,
  updated: today(),
  title: { en: '', ar: '' },
  description: { en: '', ar: '' },
  body: { en: '', ar: '' },
  hidden: true,
});

function PageEditor({ page, onChange, onBack }) {
  const { t } = useLanguage();
  const P = t.cms.pagesAdmin;
  const set = (key, val) => onChange({ ...page, [key]: val, updated: today() });
  const slugError = RESERVED.has(page.slug) ? P.reserved : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {P.title}
        </button>
        {!page.hidden ? (
          <a className="btn-ghost" href={`${SITE_URL}/${page.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            {t.cms.viewOnSite}
          </a>
        ) : null}
      </div>

      <FormCard title={P.details}>
        <BiField
          label={P.pageTitle}
          value={page.title}
          onChange={(v) => {
            const auto = page.slug.startsWith('new-page') && v.en ? slugify(v.en) : page.slug;
            onChange({ ...page, title: v, slug: auto, updated: today() });
          }}
        />
        <BiField label={P.description} multiline rows={2} value={page.description} onChange={(v) => set('description', v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label={P.slug}
            hint={slugError || P.slugHint}
            dir="ltr"
            value={page.slug}
            onChange={(v) => set('slug', slugify(v) || v)}
          />
          <label className="flex items-center gap-3 self-center rounded-xl border border-line/10 px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={page.footer !== false}
              onChange={(e) => set('footer', e.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--c-accent))]"
            />
            {P.inFooter}
          </label>
        </div>
      </FormCard>

      <FormCard title={P.content}>
        <div className="grid gap-4 xl:grid-cols-2">
          {['en', 'ar'].map((lang) => (
            <MarkdownEditor
              key={lang}
              lang={lang}
              value={page.body?.[lang]}
              hint={t.cms.blog.bodyHint}
              insertLabel={t.cms.blog.insertImage}
              onChange={(v) => set('body', { ...page.body, [lang]: v })}
            />
          ))}
        </div>
      </FormCard>
    </div>
  );
}

export default function Pages() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const P = c.pagesAdmin;
  const part = useContentPart('pages', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const [editing, setEditing] = useState(null);
  const list = part.value;

  if (!list) return <CmsLoading />;

  const setPage = (i, next) => part.update((prev) => prev.map((p, j) => (j === i ? next : p)));
  const hasReserved = list.some((p) => RESERVED.has(p.slug));
  const save = () => (hasReserved ? null : part.save());

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <CmsHeader
        title={editing !== null ? list[editing]?.title?.[lang] || list[editing]?.title?.en || P.newPage : P.title}
        description={editing !== null ? null : P.description}
        icon={FileText}
        dirty={part.dirty && !hasReserved}
        saving={part.saving}
        edited={part.edited}
        onSave={save}
        onReset={editing === null ? part.reset : null}
      >
        {editing === null ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              part.update((prev) => [...prev, newPage(prev.length + 1)]);
              setEditing(list.length);
            }}
          >
            <Plus className="h-4 w-4" />
            {P.add}
          </button>
        ) : null}
      </CmsHeader>

      {editing !== null && list[editing] ? (
        <PageEditor page={list[editing]} onChange={(next) => setPage(editing, next)} onBack={() => setEditing(null)} />
      ) : (
        <ul className="space-y-3">
          {list.map((page, i) => (
            <li
              key={`${page.slug}-${i}`}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border border-line/10 bg-elevated p-4 sm:flex-nowrap ${
                page.hidden ? 'opacity-55' : ''
              }`}
            >
              <button type="button" onClick={() => setEditing(i)} className="min-w-0 flex-1 text-start">
                <p className="truncate font-semibold text-ink">{page.title?.[lang] || page.title?.en || P.newPage}</p>
                <p className="truncate text-xs text-muted" dir="ltr">
                  /{page.slug} {page.footer !== false ? `· ${P.footerTag}` : ''} {page.hidden ? `· ${c.hidden}` : ''}
                </p>
              </button>
              <RowTools
                className="w-full justify-end sm:w-auto"
                onUp={i > 0 ? () => part.update((prev) => moveItem(prev, i, -1)) : null}
                onDown={i < list.length - 1 ? () => part.update((prev) => moveItem(prev, i, 1)) : null}
                onDelete={() => window.confirm(P.deleteConfirm) && part.update((prev) => prev.filter((_, j) => j !== i))}
              >
                <button type="button" className="icon-btn" onClick={() => setEditing(i)} aria-label={c.edit}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setPage(i, { ...page, hidden: !page.hidden })}
                  aria-label={page.hidden ? c.show : c.hide}
                >
                  {page.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </RowTools>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
