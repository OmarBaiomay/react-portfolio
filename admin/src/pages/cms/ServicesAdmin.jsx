import { useState } from 'react';
import { ArrowLeft, Boxes, Code2, Cpu, ExternalLink, Eye, EyeOff, Layers, Pencil, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_URL, assetUrl, moveItem, slugify, useContentPart } from '../../lib/cms';
import { BiField, BiStringList, CmsHeader, CmsLoading, ImageField, RowTools, TextField } from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';
import { MarkdownEditor } from './Blog';

/** Must match the ICONS map in client/src/pages/ServicePage.jsx. */
const ICONS = { Code2, Boxes, Cpu };

const bi = () => ({ en: '', ar: '' });
const newService = (n) => ({
  id: `service-${n}`,
  slug: `new-service-${n}`,
  icon: 'Code2',
  image: '',
  title: bi(),
  tagline: bi(),
  highlights: { en: [], ar: [] },
  body: bi(),
  hidden: true,
});

function ServiceEditor({ service, onChange, onBack }) {
  const { t } = useLanguage();
  const S = t.cms.servicesAdmin;
  const set = (key, val) => onChange({ ...service, [key]: val });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {S.title}
        </button>
        {!service.hidden ? (
          <a className="btn-ghost" href={`${SITE_URL}/services/${service.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            {t.cms.viewOnSite}
          </a>
        ) : null}
      </div>

      <FormCard title={S.details}>
        <BiField
          label={S.name}
          value={service.title}
          onChange={(v) => {
            const auto = service.slug.startsWith('new-service') && v.en ? slugify(v.en) : service.slug;
            onChange({ ...service, title: v, slug: auto });
          }}
        />
        <BiField label={S.tagline} multiline rows={2} value={service.tagline} onChange={(v) => set('tagline', v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={S.slug} hint={S.slugHint} dir="ltr" value={service.slug} onChange={(v) => set('slug', slugify(v) || v)} />
          <TextField label={S.id} hint={S.idHint} dir="ltr" value={service.id} onChange={(v) => set('id', slugify(v) || v)} />
        </div>
        <div>
          <p className="form-label">{S.icon}</p>
          <div className="flex gap-2">
            {Object.entries(ICONS).map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                onClick={() => set('icon', name)}
                className={`icon-btn ${service.icon === name ? '!border-accent !bg-accent !text-white' : ''}`}
                title={name}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <ImageField label={S.image} value={service.image} onChange={(v) => set('image', v)} />
        <BiStringList label={S.highlights} value={service.highlights} onChange={(v) => set('highlights', v)} />
      </FormCard>

      <FormCard title={S.body}>
        <div className="grid gap-4 xl:grid-cols-2">
          {['en', 'ar'].map((lang) => (
            <MarkdownEditor
              key={lang}
              lang={lang}
              value={service.body?.[lang]}
              hint={t.cms.blog.bodyHint}
              insertLabel={t.cms.blog.insertImage}
              onChange={(v) => set('body', { ...service.body, [lang]: v })}
            />
          ))}
        </div>
      </FormCard>
    </div>
  );
}

export default function ServicesAdmin() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const S = c.servicesAdmin;
  const part = useContentPart('services', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const [editing, setEditing] = useState(null);
  const list = part.value;

  if (!list) return <CmsLoading />;
  const setItem = (i, next) => part.update((prev) => prev.map((s, j) => (j === i ? next : s)));

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <CmsHeader
        title={editing !== null ? list[editing]?.title?.[lang] || list[editing]?.title?.en || S.newService : S.title}
        description={editing !== null ? null : S.description}
        icon={Layers}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={editing === null ? part.reset : null}
      >
        {editing === null ? (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              part.update((prev) => [...prev, newService(prev.length + 1)]);
              setEditing(list.length);
            }}
          >
            <Plus className="h-4 w-4" />
            {S.add}
          </button>
        ) : null}
      </CmsHeader>

      {editing !== null && list[editing] ? (
        <ServiceEditor service={list[editing]} onChange={(next) => setItem(editing, next)} onBack={() => setEditing(null)} />
      ) : (
        <ul className="space-y-3">
          {list.map((service, i) => {
            const Icon = ICONS[service.icon] || Sparkles;
            return (
              <li
                key={`${service.slug}-${i}`}
                className={`flex flex-wrap items-center gap-3 rounded-2xl border border-line/10 bg-elevated p-3 sm:flex-nowrap ${
                  service.hidden ? 'opacity-55' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setEditing(i)}
                  className="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-line/10 bg-surface"
                >
                  {service.image ? (
                    <img src={assetUrl(service.image)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon className="h-6 w-6 text-accent" />
                  )}
                </button>
                <button type="button" onClick={() => setEditing(i)} className="min-w-0 flex-1 text-start">
                  <p className="truncate font-semibold text-ink">{service.title?.[lang] || service.title?.en || S.newService}</p>
                  <p className="truncate text-xs text-muted" dir="ltr">
                    /services/{service.slug} {service.hidden ? `· ${c.hidden}` : ''}
                  </p>
                </button>
                <RowTools
                  className="w-full justify-end sm:w-auto"
                  onUp={i > 0 ? () => part.update((prev) => moveItem(prev, i, -1)) : null}
                  onDown={i < list.length - 1 ? () => part.update((prev) => moveItem(prev, i, 1)) : null}
                  onDelete={() => window.confirm(S.deleteConfirm) && part.update((prev) => prev.filter((_, j) => j !== i))}
                >
                  <button type="button" className="icon-btn" onClick={() => setEditing(i)} aria-label={c.edit}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setItem(i, { ...service, hidden: !service.hidden })}
                    aria-label={service.hidden ? c.show : c.hide}
                  >
                    {service.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </RowTools>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
