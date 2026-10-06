import { Eye, EyeOff, LayoutList } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { moveItem, useContentPart } from '../../lib/cms';
import { CmsHeader, CmsLoading, RowTools } from '../../components/cms/CmsFields';

export default function Sections() {
  const { t } = useLanguage();
  const c = t.cms;
  const P = c.sectionsPage;
  const part = useContentPart('sections', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const list = part.value;

  if (!list) return <CmsLoading />;

  const toggle = (i) =>
    part.update((prev) => prev.map((s, j) => (j === i ? { ...s, visible: s.visible === false } : s)));

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <CmsHeader
        title={P.title}
        description={P.description}
        icon={LayoutList}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      />

      <p className="mb-3 rounded-xl border border-dashed border-line/15 px-4 py-3 text-sm text-muted">{P.hero}</p>

      <ol className="space-y-2">
        {list.map((section, i) => {
          const visible = section.visible !== false;
          return (
            <li
              key={section.id}
              className={`flex items-center gap-3 rounded-xl border border-line/10 bg-elevated px-4 py-3 transition ${
                visible ? '' : 'opacity-55'
              }`}
            >
              <span className="w-6 shrink-0 text-center font-mono text-xs text-muted">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{P.names[section.id] || section.id}</p>
                <p className="text-xs text-muted">{visible ? c.visible : c.hidden}</p>
              </div>
              <RowTools
                onUp={i > 0 ? () => part.update((prev) => moveItem(prev, i, -1)) : null}
                onDown={i < list.length - 1 ? () => part.update((prev) => moveItem(prev, i, 1)) : null}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`icon-btn ${visible ? '' : '!border-accent/50 !text-accent'}`}
                  aria-label={visible ? c.hide : c.show}
                  title={visible ? c.hide : c.show}
                >
                  {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </RowTools>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
