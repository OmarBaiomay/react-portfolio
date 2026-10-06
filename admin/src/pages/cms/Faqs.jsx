import { Eye, EyeOff, HelpCircle, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { moveItem, useContentPart } from '../../lib/cms';
import { BiField, CmsHeader, CmsLoading, RowTools } from '../../components/cms/CmsFields';

export default function Faqs() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const F = c.faqs;
  const part = useContentPart('faqs', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const list = part.value;

  if (!list) return <CmsLoading />;

  const setItem = (i, patch) => part.update((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = () => part.update((prev) => [...prev, { q: { en: '', ar: '' }, a: { en: '', ar: '' } }]);

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <CmsHeader
        title={F.title}
        description={F.description}
        icon={HelpCircle}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      >
        <button type="button" className="btn-ghost" onClick={add}>
          <Plus className="h-4 w-4" />
          {F.add}
        </button>
      </CmsHeader>

      <div className="space-y-4">
        {list.map((item, i) => (
          <div
            key={i}
            className={`form-card ${item.hidden ? 'opacity-60' : ''}`}
          >
            <div className="form-card-header items-center">
              <p className="min-w-0 flex-1 truncate font-semibold text-ink">
                <span className="me-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                {item.q?.[lang] || item.q?.en || F.question}
              </p>
              <RowTools
                onUp={i > 0 ? () => part.update((prev) => moveItem(prev, i, -1)) : null}
                onDown={i < list.length - 1 ? () => part.update((prev) => moveItem(prev, i, 1)) : null}
                onDelete={() => part.update((prev) => prev.filter((_, j) => j !== i))}
              >
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setItem(i, { hidden: !item.hidden })}
                  aria-label={item.hidden ? c.show : c.hide}
                  title={item.hidden ? c.show : c.hide}
                >
                  {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </RowTools>
            </div>
            <div className="form-card-body">
              <BiField label={F.question} value={item.q} onChange={(v) => setItem(i, { q: v })} />
              <BiField label={F.answer} multiline rows={4} value={item.a} onChange={(v) => setItem(i, { a: v })} />
            </div>
          </div>
        ))}
        {!list.length ? <p className="py-10 text-center text-muted">{c.empty}</p> : null}
      </div>
    </div>
  );
}
