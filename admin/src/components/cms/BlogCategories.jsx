import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Save, Tags } from 'lucide-react';
import { blogAPI } from '../../services/api';
import { moveItem } from '../../lib/cms';
import { RowTools } from './CmsFields';

/** Manage blog categories: add, rename (EN/AR), reorder and delete. */
export default function BlogCategories({ categories, setCategories, posts, labels: B, t }) {
  const [draft, setDraft] = useState({ en: '', ar: '' });
  const [adding, setAdding] = useState(false);
  const [edits, setEdits] = useState({}); // slug -> { en, ar } while edited
  const [busy, setBusy] = useState(null);

  const counts = posts.reduce((map, p) => (p.category ? { ...map, [p.category]: (map[p.category] || 0) + 1 } : map), {});
  const errorToast = (error) => toast.error(error.response?.data?.message || t.cms.saveError);

  const add = async (e) => {
    e.preventDefault();
    if (!draft.en.trim() && !draft.ar.trim()) return;
    setAdding(true);
    try {
      const { data } = await blogAPI.createCategory(draft);
      setCategories((list) => (list.some((c) => c.slug === data.slug) ? list : [...list, data]));
      setDraft({ en: '', ar: '' });
      toast.success(B.categoryCreated);
    } catch (error) {
      errorToast(error);
    } finally {
      setAdding(false);
    }
  };

  const save = async (cat) => {
    setBusy(cat.slug);
    try {
      const { data } = await blogAPI.updateCategory(cat.slug, { name: edits[cat.slug] });
      setCategories((list) => list.map((c) => (c.slug === cat.slug ? data : c)));
      setEdits(({ [cat.slug]: _done, ...rest }) => rest);
      toast.success(B.categorySaved);
    } catch (error) {
      errorToast(error);
    } finally {
      setBusy(null);
    }
  };

  // Reorder locally, then persist the new positions.
  const move = async (index, dir) => {
    const next = moveItem(categories, index, dir).map((c, i) => ({ ...c, sortOrder: (i + 1) * 10 }));
    setCategories(next);
    try {
      await Promise.all(
        next
          .filter((c, i) => c.slug !== categories[i]?.slug)
          .map((c) => blogAPI.updateCategory(c.slug, { sortOrder: c.sortOrder }))
      );
    } catch (error) {
      errorToast(error);
    }
  };

  const remove = async (cat) => {
    if (!window.confirm(B.categoryDeleteConfirm)) return;
    setBusy(cat.slug);
    try {
      await blogAPI.deleteCategory(cat.slug);
      setCategories((list) => list.filter((c) => c.slug !== cat.slug));
      toast.success(B.categoryDeleted);
    } catch (error) {
      errorToast(error);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="rounded-2xl border border-line/10 bg-elevated p-4">
        <p className="mb-3 flex items-center gap-2 font-semibold text-ink">
          <Tags className="h-4 w-4 text-accent" />
          {B.addCategory}
        </p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            dir="ltr"
            className="field"
            placeholder={B.categoryNameEn}
            value={draft.en}
            onChange={(e) => setDraft({ ...draft, en: e.target.value })}
          />
          <input
            dir="rtl"
            className="field"
            placeholder={B.categoryNameAr}
            value={draft.ar}
            onChange={(e) => setDraft({ ...draft, ar: e.target.value })}
          />
          <button type="submit" className="btn-primary" disabled={adding || (!draft.en.trim() && !draft.ar.trim())}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {B.create}
          </button>
        </div>
      </form>

      <p className="text-xs text-muted">{B.categoriesHint}</p>

      {categories.length ? (
        <ul className="space-y-2">
          {categories.map((cat, i) => {
            const value = edits[cat.slug] || { en: cat.name?.en || '', ar: cat.name?.ar || '' };
            const dirty = Boolean(edits[cat.slug]);
            return (
              <li
                key={cat.slug}
                className="grid items-center gap-3 rounded-2xl border border-line/10 bg-elevated p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
              >
                <input
                  dir="ltr"
                  className="field"
                  aria-label={B.categoryNameEn}
                  value={value.en}
                  onChange={(e) => setEdits({ ...edits, [cat.slug]: { ...value, en: e.target.value } })}
                />
                <input
                  dir="rtl"
                  className="field"
                  aria-label={B.categoryNameAr}
                  value={value.ar}
                  onChange={(e) => setEdits({ ...edits, [cat.slug]: { ...value, ar: e.target.value } })}
                />
                <span className="whitespace-nowrap text-xs text-muted">
                  <span dir="ltr" className="me-2 font-mono">
                    {cat.slug}
                  </span>
                  {B.categoryPosts.replace('{n}', counts[cat.slug] || 0)}
                </span>
                <div className="flex items-center justify-end gap-1">
                  {dirty ? (
                    <button type="button" className="btn-primary !px-3 !py-2 text-xs" disabled={busy === cat.slug} onClick={() => save(cat)}>
                      {busy === cat.slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      {B.saveCategory}
                    </button>
                  ) : null}
                  <RowTools
                    onUp={i > 0 ? () => move(i, -1) : null}
                    onDown={i < categories.length - 1 ? () => move(i, 1) : null}
                    onDelete={() => remove(cat)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line/15 p-10 text-center text-muted">{B.noCategoriesYet}</p>
      )}
    </div>
  );
}
