import {
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  Plus,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { moveItem, slugify, useContentPart } from '../../lib/cms';
import { BiField, CmsHeader, CmsLoading, RowTools } from '../../components/cms/CmsFields';

/** Must match the icon map in client/src/components/Industries.jsx. */
export const INDUSTRY_ICONS = { Building2, Truck, ShoppingBag, GraduationCap, HeartPulse, Landmark, Factory, Briefcase };

export default function Industries() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const I = c.industries;
  const part = useContentPart('industries', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const list = part.value;

  if (!list) return <CmsLoading />;

  const setItem = (i, patch) => part.update((prev) => prev.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = () =>
    part.update((prev) => [
      ...prev,
      { id: `industry-${prev.length + 1}`, icon: 'Briefcase', title: { en: '', ar: '' }, blurb: { en: '', ar: '' } },
    ]);

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <CmsHeader
        title={I.title}
        description={I.description}
        icon={Building2}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      >
        <button type="button" className="btn-ghost" onClick={add}>
          <Plus className="h-4 w-4" />
          {I.add}
        </button>
      </CmsHeader>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((item, i) => {
          const Icon = INDUSTRY_ICONS[item.icon] || Briefcase;
          return (
            <div key={i} className={`form-card ${item.hidden ? 'opacity-60' : ''}`}>
              <div className="form-card-header items-center">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="min-w-0 flex-1 truncate font-semibold text-ink">
                  {item.title?.[lang] || item.title?.en || I.name}
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
                  >
                    {item.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </RowTools>
              </div>
              <div className="form-card-body">
                <BiField
                  label={I.name}
                  value={item.title}
                  onChange={(v) => setItem(i, { title: v, id: item.id || slugify(v.en) })}
                />
                <BiField label={I.blurb} multiline rows={2} value={item.blurb} onChange={(v) => setItem(i, { blurb: v })} />
                <div>
                  <p className="form-label">{I.icon}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(INDUSTRY_ICONS).map(([name, IconOpt]) => (
                      <button
                        key={name}
                        type="button"
                        title={name}
                        onClick={() => setItem(i, { icon: name })}
                        className={`icon-btn ${item.icon === name ? '!border-accent !bg-accent !text-white' : ''}`}
                      >
                        <IconOpt className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
