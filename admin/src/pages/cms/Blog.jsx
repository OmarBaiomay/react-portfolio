import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  ArrowLeft,
  ExternalLink,
  Eye,
  ImagePlus,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { blogAPI, mediaAPI } from '../../services/api';
import { SITE_URL, assetUrl, moveItem, slugify } from '../../lib/cms';
import { BiField, CmsLoading, ImageField, RowTools, StringList, TextField } from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';
import CategoryPicker from '../../components/cms/CategoryPicker';
import BlogCategories from '../../components/cms/BlogCategories';

const bi = () => ({ en: '', ar: '' });

const emptyPost = (author) => ({
  slug: '',
  title: bi(),
  excerpt: bi(),
  body: bi(),
  coverUrl: '',
  tags: [],
  category: '',
  seo: { title: bi(), description: bi() },
  faq: [],
  author: author || '',
  status: 'draft',
  publishedAt: null,
});

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export function MarkdownEditor({ lang, value, onChange, hint, insertLabel }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [tab, setTab] = useState('write');
  const [busy, setBusy] = useState(false);
  const { t } = useLanguage();
  const html = useMemo(
    () => DOMPurify.sanitize(marked.parse(value || '', { gfm: true, breaks: true })),
    [value]
  );

  const insertImage = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const { data } = await mediaAPI.upload(file);
      const el = ref.current;
      const at = el ? el.selectionStart : (value || '').length;
      const snippet = `\n![](${data.url})\n`;
      onChange((value || '').slice(0, at) + snippet + (value || '').slice(at));
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.uploadFail);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="rounded-xl border border-line/10">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/10 px-3 py-2">
        <span className="text-[10px] font-bold uppercase text-muted">{lang === 'en' ? 'English' : 'العربية'}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn-ghost !px-2.5 !py-1.5 text-xs"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {insertLabel}
          </button>
          <div className="locale-tabs !p-0.5">
            {['write', 'preview'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`locale-tab !px-2.5 !py-1 text-xs ${tab === key ? 'locale-tab-active' : ''}`}
              >
                {key === 'write' ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      {tab === 'write' ? (
        <textarea
          ref={ref}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="block w-full resize-y bg-transparent p-3 font-mono text-sm leading-relaxed text-ink outline-none"
        />
      ) : (
        <div
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="blog-preview min-h-[16rem] p-4 text-sm leading-7 text-ink"
          // Sanitized above.
          dangerouslySetInnerHTML={{ __html: html.replace(/src="\/api\//g, `src="${assetUrl('/api/')}`) }}
        />
      )}
      <p className="border-t border-line/10 px-3 py-2 text-[11px] text-muted">{hint}</p>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => insertImage(e.target.files?.[0])}
      />
    </div>
  );
}

function PostEditor({ initial, onBack, onSaved }) {
  const { t, lang } = useLanguage();
  const B = t.cms.blog;
  const [post, setPost] = useState(initial);
  const [saving, setSaving] = useState(false);
  const isNew = !post.id;
  const set = (key, val) => setPost((p) => ({ ...p, [key]: val }));

  const save = async (status = post.status) => {
    const payload = { ...post, status, slug: post.slug || slugify(post.title.en) };
    setSaving(true);
    try {
      const { data } = isNew ? await blogAPI.create(payload) : await blogAPI.update(post.id, payload);
      setPost(data);
      toast.success(isNew ? B.created : B.updated);
      onSaved(data);
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-2 border-b border-line/10 bg-bg/90 px-1 py-3 backdrop-blur">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {B.title}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {post.id && post.status === 'published' ? (
            <a className="btn-ghost" href={`${SITE_URL}/blog/${post.slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.cms.viewOnSite}
            </a>
          ) : null}
          <button type="button" className="btn-ghost" disabled={saving} onClick={() => save('draft')}>
            <Save className="h-4 w-4" />
            {B.draft}
          </button>
          <button type="button" className="btn-primary" disabled={saving} onClick={() => save('published')}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Newspaper className="h-4 w-4" />}
            {B.published}
          </button>
        </div>
      </div>

      <FormCard title={isNew ? B.add : B.edit}>
        <BiField
          label={B.postTitle}
          value={post.title}
          onChange={(v) => setPost((p) => ({ ...p, title: v, slug: p.id || p.slugTouched ? p.slug : slugify(v.en) }))}
        />
        <BiField label={B.excerpt} multiline rows={2} value={post.excerpt} onChange={(v) => set('excerpt', v)} />
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label={B.slug}
            hint={B.slugHint}
            dir="ltr"
            value={post.slug}
            onChange={(v) => setPost((p) => ({ ...p, slug: slugify(v) || v, slugTouched: true }))}
          />
          <TextField label={B.author} value={post.author} onChange={(v) => set('author', v)} />
          <TextField
            label={B.publishedAt}
            type="date"
            dir="ltr"
            value={toDateInput(post.publishedAt)}
            onChange={(v) => set('publishedAt', v ? new Date(v).toISOString() : null)}
          />
        </div>
        <ImageField label={B.cover} value={post.coverUrl} onChange={(v) => set('coverUrl', v)} />
        <CategoryPicker value={post.category || ''} onChange={(v) => set('category', v)} lang={lang} labels={B} />
        <StringList label={B.tags} value={post.tags} onChange={(v) => set('tags', v)} />
      </FormCard>

      <FormCard title={B.seo}>
        <BiField
          label={B.seoTitle}
          hint={B.seoTitleHint}
          value={post.seo?.title || bi()}
          onChange={(v) => set('seo', { ...post.seo, title: v })}
        />
        <BiField
          label={B.seoDescription}
          hint={B.seoDescriptionHint}
          multiline
          rows={2}
          value={post.seo?.description || bi()}
          onChange={(v) => set('seo', { ...post.seo, description: v })}
        />
      </FormCard>

      <FormCard title={B.faq}>
        {(post.faq || []).map((item, i, list) => (
          <div key={i} className="rounded-xl border border-line/10 bg-bg/40 p-3">
            <div className="mb-2 flex justify-end">
              <RowTools
                onUp={i > 0 ? () => set('faq', moveItem(list, i, -1)) : null}
                onDown={i < list.length - 1 ? () => set('faq', moveItem(list, i, 1)) : null}
                onDelete={() => set('faq', list.filter((_, j) => j !== i))}
              />
            </div>
            <div className="space-y-3">
              <BiField label={B.faqQuestion} value={item.q} onChange={(q) => set('faq', list.map((row, j) => (j === i ? { ...row, q } : row)))} />
              <BiField label={B.faqAnswer} multiline rows={3} value={item.a} onChange={(a) => set('faq', list.map((row, j) => (j === i ? { ...row, a } : row)))} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => set('faq', [...(post.faq || []), { q: bi(), a: bi() }])}>
          <Plus className="h-3.5 w-3.5" />
          {B.addFaq}
        </button>
      </FormCard>

      <FormCard title={B.body}>
        <div className="grid gap-4 xl:grid-cols-2">
          {['en', 'ar'].map((lang) => (
            <MarkdownEditor
              key={lang}
              lang={lang}
              value={post.body?.[lang]}
              hint={B.bodyHint}
              insertLabel={B.insertImage}
              onChange={(v) => set('body', { ...post.body, [lang]: v })}
            />
          ))}
        </div>
      </FormCard>
    </div>
  );
}

export default function Blog() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const B = t.cms.blog;
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null);
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('posts');
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [filterCat, setFilterCat] = useState('');
  const [bulkCat, setBulkCat] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);

  // Open a post directly, e.g. a draft the AI assistant just wrote.
  useEffect(() => {
    const id = params.get('edit');
    if (!id || !posts) return;
    const post = posts.find((p) => p.id === id);
    if (post) setEditing(post);
    setParams({}, { replace: true });
  }, [params, posts, setParams]);

  const load = async () => {
    try {
      const { data } = await blogAPI.getAll();
      setPosts(data);
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.loadError);
      setPosts([]);
    }
  };

  useEffect(() => {
    load();
    blogAPI
      .categories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catName = (slug) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? c.name?.[lang] || c.name?.en || c.name?.ar || slug : '';
  };

  const runBulk = async (action, category) => {
    const ids = [...selected];
    if (!ids.length) return;
    if (action === 'delete' && !window.confirm(B.bulkDeleteConfirm.replace('{n}', ids.length))) return;
    setBulkBusy(true);
    try {
      const { data } = await blogAPI.bulk(ids, action, category);
      toast.success((action === 'delete' ? B.bulkDeleted : B.bulkDone).replace('{n}', data.count));
      setSelected(new Set());
      setBulkCat('');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.saveError);
    } finally {
      setBulkBusy(false);
    }
  };

  const remove = async (post) => {
    if (!window.confirm(B.deleteConfirm)) return;
    try {
      await blogAPI.remove(post.id);
      toast.success(B.deleted);
      setPosts((list) => list.filter((p) => p.id !== post.id));
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.saveError);
    }
  };

  if (!posts) return <CmsLoading />;

  const visible = posts.filter((p) =>
    !filterCat ? true : filterCat === '__none' ? !p.category : p.category === filterCat
  );

  if (editing) {
    return (
      <div className="mx-auto max-w-6xl pb-16">
        <PostEditor
          initial={editing}
          onBack={() => {
            setEditing(null);
            load();
          }}
          onSaved={() => load()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
            <Newspaper className="h-3.5 w-3.5" />
            {t.cms.website}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{B.title}</h1>
          <p className="mt-1 text-sm text-muted">{B.description}</p>
          <div className="locale-tabs mt-4 w-fit" role="tablist">
            {[
              ['posts', B.postsTab, posts.length],
              ['categories', B.categoriesTab, categories.length],
            ].map(([key, label, n]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={`locale-tab ${view === key ? 'locale-tab-active' : ''}`}
              >
                {label} <span className="ms-1 text-xs opacity-70">{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
        <Link to="/ai" className="btn-ghost">
          <Sparkles className="h-4 w-4" />
          {t.cms.ai.title}
        </Link>
        <button type="button" className="btn-primary" onClick={() => setEditing(emptyPost(user?.fullName))}>
          <Plus className="h-4 w-4" />
          {B.add}
        </button>
        </div>
      </div>

      {view === 'categories' ? (
        <BlogCategories categories={categories} setCategories={setCategories} posts={posts} labels={B} t={t} />
      ) : posts.length ? (
        <>
          {/* Toolbar: select all + filter; turns into the bulk bar when posts are selected */}
          <div className="sticky top-0 z-20 -mx-1 mb-3 flex flex-wrap items-center gap-2 border-b border-line/10 bg-bg/90 px-1 py-3 backdrop-blur">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-line/15 px-3 py-2 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[rgb(var(--c-accent))]"
                checked={visible.length > 0 && visible.every((p) => selected.has(p.id))}
                ref={(el) => {
                  if (el) el.indeterminate = visible.some((p) => selected.has(p.id)) && !visible.every((p) => selected.has(p.id));
                }}
                onChange={(e) =>
                  setSelected((prev) => {
                    const next = new Set(prev);
                    visible.forEach((p) => (e.target.checked ? next.add(p.id) : next.delete(p.id)));
                    return next;
                  })
                }
              />
              {selected.size ? B.selectedCount.replace('{n}', selected.size) : B.selectAll}
            </label>

            {selected.size ? (
              <>
                <button type="button" className="btn-ghost !py-2 text-sm" disabled={bulkBusy} onClick={() => runBulk('publish')}>
                  <Newspaper className="h-4 w-4" />
                  {B.bulkPublish}
                </button>
                <button type="button" className="btn-ghost !py-2 text-sm" disabled={bulkBusy} onClick={() => runBulk('draft')}>
                  <Save className="h-4 w-4" />
                  {B.bulkDraft}
                </button>
                <select
                  className="field !h-10 !w-auto text-sm"
                  value={bulkCat}
                  disabled={bulkBusy}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBulkCat(v);
                    if (v) runBulk('category', v === '__none' ? '' : v);
                  }}
                  aria-label={B.bulkCategory}
                >
                  <option value="">{B.bulkCategory}</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name?.[lang] || c.name?.en}
                    </option>
                  ))}
                  <option value="__none">{B.noCategory}</option>
                </select>
                <button
                  type="button"
                  className="btn-ghost !py-2 text-sm hover:!border-red-500/50 hover:!text-red-500"
                  disabled={bulkBusy}
                  onClick={() => runBulk('delete')}
                >
                  <Trash2 className="h-4 w-4" />
                  {B.bulkDelete}
                </button>
                <button type="button" className="text-sm font-semibold text-muted hover:text-ink" onClick={() => setSelected(new Set())}>
                  {B.clearSelection}
                </button>
                {bulkBusy ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : null}
              </>
            ) : (
              <select
                className="field !h-10 !w-auto text-sm ms-auto"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                aria-label={B.category}
              >
                <option value="">
                  {B.category}: {B.filterAll}
                </option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name?.[lang] || c.name?.en}
                  </option>
                ))}
                <option value="__none">{B.noCategory}</option>
              </select>
            )}
          </div>

          <ul className="space-y-3">
            {visible.map((post) => {
              const isSel = selected.has(post.id);
              return (
                <li
                  key={post.id}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border bg-elevated p-3 transition sm:flex-nowrap ${
                    isSel ? 'border-accent/50 ring-2 ring-accent/15' : 'border-line/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 cursor-pointer accent-[rgb(var(--c-accent))]"
                    checked={isSel}
                    aria-label={post.title?.[lang] || post.title?.en || post.slug}
                    onChange={() =>
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (next.has(post.id)) next.delete(post.id);
                        else next.add(post.id);
                        return next;
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setEditing(post)}
                    className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-line/10 bg-surface"
                  >
                    {post.coverUrl ? <img src={assetUrl(post.coverUrl)} alt="" className="h-full w-full object-cover" /> : null}
                  </button>
                  <button type="button" onClick={() => setEditing(post)} className="min-w-0 flex-1 text-start">
                    <p className="truncate font-semibold text-ink">
                      {post.title?.[lang] || post.title?.en || post.title?.ar || post.slug}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span
                        className={`rounded-full px-2 py-0.5 font-semibold ${
                          post.status === 'published' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-line/10 text-muted'
                        }`}
                      >
                        {post.status === 'published' ? B.published : B.draft}
                      </span>
                      {post.category ? (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-semibold text-accent">{catName(post.category)}</span>
                      ) : null}
                      {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
                      <span dir="ltr">/blog/{post.slug}</span>
                    </p>
                  </button>
                  <div className="flex w-full justify-end gap-1 sm:w-auto">
                    <button type="button" className="icon-btn" onClick={() => setEditing(post)} aria-label={t.cms.edit}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn hover:!border-red-500/50 hover:!text-red-500"
                      onClick={() => remove(post)}
                      aria-label={t.common.delete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line/15 p-10 text-center text-muted">{B.empty}</p>
      )}
    </div>
  );
}
