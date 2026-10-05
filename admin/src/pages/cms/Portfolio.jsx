import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Eye, EyeOff, FolderOpen, Pencil, Plus, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SITE_URL, assetUrl, moveItem, slugify, useContentPart } from '../../lib/cms';
import {
  BiField,
  BiStringList,
  CmsHeader,
  CmsLoading,
  ImageField,
  RowTools,
  StringList,
  TextField,
} from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';
import { contentAPI } from '../../services/api';

const bi = () => ({ en: '', ar: '' });

const newProject = (n) => ({
  slug: `new-project-${n}`,
  services: [],
  imgSrc: '',
  liveUrl: '',
  industry: '',
  year: String(new Date().getFullYear()),
  title: bi(),
  tags: { en: [], ar: [] },
  summary: bi(),
  client: bi(),
  role: bi(),
  overview: bi(),
  challenge: bi(),
  solution: bi(),
  results: { en: [], ar: [] },
  stack: [],
  gallery: { desktop: [], tablet: [], mobile: [] },
  hidden: true,
});

function ShotList({ label, list = [], onChange, aspect, addLabel, altLabel }) {
  return (
    <div className="min-w-0">
      <p className="form-label">{label}</p>
      <div className="space-y-3">
        {list.map((shot, i) => (
          <div key={i} className="rounded-xl border border-line/10 bg-bg/40 p-3">
            <div className="mb-2 flex justify-end">
              <RowTools
                onUp={i > 0 ? () => onChange(moveItem(list, i, -1)) : null}
                onDown={i < list.length - 1 ? () => onChange(moveItem(list, i, 1)) : null}
                onDelete={() => onChange(list.filter((_, j) => j !== i))}
              />
            </div>
            <ImageField
              value={shot.src}
              aspect={aspect}
              onChange={(src) => onChange(list.map((s, j) => (j === i ? { ...s, src } : s)))}
            />
            <div className="mt-3">
              <BiField
                label={altLabel}
                value={shot.alt}
                onChange={(alt) => onChange(list.map((s, j) => (j === i ? { ...s, alt } : s)))}
              />
            </div>
          </div>
        ))}
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => onChange([...list, { src: '', alt: bi() }])}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>
    </div>
  );
}

function ProjectEditor({ project, industries, services, onChange, onBack }) {
  const { t, lang } = useLanguage();
  const P = t.cms.portfolio;
  const set = (key, val) => onChange({ ...project, [key]: val });
  const gallery = project.gallery || { desktop: [], tablet: [], mobile: [] };
  const setShots = (kind, list) => set('gallery', { ...gallery, [kind]: list });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="btn-ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t.cms.portfolio.title}
        </button>
        {project.slug ? (
          <a className="btn-ghost" href={`${SITE_URL}/work/${project.slug}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            {t.cms.viewOnSite}
          </a>
        ) : null}
      </div>

      <FormCard title={P.basics}>
        <BiField
          label={P.name}
          value={project.title}
          onChange={(v) => {
            const autoSlug = project.slug.startsWith('new-project') && v.en ? slugify(v.en) : project.slug;
            onChange({ ...project, title: v, slug: autoSlug });
          }}
        />
        <BiField label={P.summary} multiline rows={2} value={project.summary} onChange={(v) => set('summary', v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={P.slug} hint={P.slugHint} dir="ltr" value={project.slug} onChange={(v) => set('slug', slugify(v) || v)} />
          <TextField label={P.liveUrl} dir="ltr" type="url" value={project.liveUrl} onChange={(v) => set('liveUrl', v)} placeholder="https://…" />
          <TextField label={P.year} dir="ltr" value={project.year} onChange={(v) => set('year', v)} />
          <label className="block min-w-0">
            <span className="form-label">{P.industry}</span>
            <select value={project.industry || ''} onChange={(e) => set('industry', e.target.value)} className="field">
              <option value="">{P.none}</option>
              {industries.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.title?.[lang] || ind.title?.en || ind.id}
                </option>
              ))}
            </select>
          </label>
        </div>
        <BiField label={P.client} value={project.client} onChange={(v) => set('client', v)} />
        <BiField label={P.role} value={project.role} onChange={(v) => set('role', v)} />
        <BiStringList label={P.tags} value={project.tags} onChange={(v) => set('tags', v)} />
        <div>
          <p className="form-label">{P.services}</p>
          <div className="flex flex-wrap gap-2">
            {services.map((sv) => {
              const on = (project.services || []).includes(sv.id);
              return (
                <button
                  key={sv.id}
                  type="button"
                  onClick={() =>
                    set('services', on ? project.services.filter((x) => x !== sv.id) : [...(project.services || []), sv.id])
                  }
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    on ? 'border-accent bg-accent text-white' : 'border-line/15 text-ink hover:border-accent/50'
                  }`}
                >
                  {sv.title?.[lang] || sv.title?.en || sv.id}
                </button>
              );
            })}
          </div>
        </div>
      </FormCard>

      <FormCard title={P.images}>
        <ImageField label={P.cover} aspect="aspect-square" value={project.imgSrc} onChange={(v) => set('imgSrc', v)} />
      </FormCard>

      <FormCard title={P.story}>
        <BiField label={P.overview} multiline rows={4} value={project.overview} onChange={(v) => set('overview', v)} />
        <BiField label={P.challenge} multiline rows={4} value={project.challenge} onChange={(v) => set('challenge', v)} />
        <BiField label={P.solution} multiline rows={4} value={project.solution} onChange={(v) => set('solution', v)} />
        <BiStringList label={P.results} value={project.results} onChange={(v) => set('results', v)} />
        <StringList label={P.stack} dir="ltr" value={project.stack} onChange={(v) => set('stack', v)} />
      </FormCard>

      <FormCard title={P.gallery}>
        <ShotList label={P.desktop} aspect="aspect-[16/10]" list={gallery.desktop} onChange={(l) => setShots('desktop', l)} addLabel={P.addShot} altLabel={P.alt} />
        <ShotList label={P.tablet} aspect="aspect-[820/1180]" list={gallery.tablet} onChange={(l) => setShots('tablet', l)} addLabel={P.addShot} altLabel={P.alt} />
        <ShotList label={P.mobile} aspect="aspect-[390/844]" list={gallery.mobile} onChange={(l) => setShots('mobile', l)} addLabel={P.addShot} altLabel={P.alt} />
      </FormCard>
    </div>
  );
}

export default function Portfolio() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const P = c.portfolio;
  const part = useContentPart('projects', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const [editing, setEditing] = useState(null);
  const [industries, setIndustries] = useState([]);
  const [services, setServices] = useState([]);
  const [params, setParams] = useSearchParams();

  // Open a project directly, e.g. after the AI assistant created it.
  useEffect(() => {
    const slug = params.get('edit');
    if (!slug || !part.value) return;
    const index = part.value.findIndex((p) => p.slug === slug);
    if (index !== -1) setEditing(index);
    setParams({}, { replace: true });
  }, [params, part.value, setParams]);

  useEffect(() => {
    contentAPI
      .get()
      .then(({ data }) => {
        setIndustries(data.industries || []);
        setServices(data.services || []);
      })
      .catch(() => {});
  }, []);

  const list = part.value;
  if (!list) return <CmsLoading />;

  const setProject = (i, next) => part.update((prev) => prev.map((p, j) => (j === i ? next : p)));
  const add = () => {
    part.update((prev) => [...prev, newProject(prev.length + 1)]);
    setEditing(list.length);
  };
  const remove = (i) => {
    if (!window.confirm(P.deleteConfirm)) return;
    part.update((prev) => prev.filter((_, j) => j !== i));
  };

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <CmsHeader
        title={editing !== null ? list[editing]?.title?.[lang] || list[editing]?.title?.en || P.newTitle : P.title}
        description={editing !== null ? null : P.description}
        icon={FolderOpen}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={editing === null ? part.reset : null}
      >
        {editing === null ? (
          <Link to="/ai" className="btn-ghost">
            <Sparkles className="h-4 w-4" />
            {t.cms.ai.title}
          </Link>
        ) : null}
        {editing === null ? (
          <button type="button" className="btn-ghost" onClick={add}>
            <Plus className="h-4 w-4" />
            {P.add}
          </button>
        ) : null}
      </CmsHeader>

      {editing !== null && list[editing] ? (
        <ProjectEditor
          project={list[editing]}
          industries={industries}
          services={services}
          onChange={(next) => setProject(editing, next)}
          onBack={() => setEditing(null)}
        />
      ) : (
        <ul className="space-y-3">
          {list.map((project, i) => (
            <li
              key={`${project.slug}-${i}`}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border border-line/10 bg-elevated p-3 transition sm:flex-nowrap ${
                project.hidden ? 'opacity-55' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setEditing(i)}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line/10 bg-surface sm:h-20 sm:w-20"
              >
                {project.imgSrc ? <img src={assetUrl(project.imgSrc)} alt="" className="h-full w-full object-cover" /> : null}
              </button>
              <button type="button" onClick={() => setEditing(i)} className="min-w-0 flex-1 text-start">
                <p className="truncate font-semibold text-ink">
                  {project.title?.[lang] || project.title?.en || P.newTitle}
                </p>
                <p className="truncate text-xs text-muted">
                  /work/{project.slug} {project.hidden ? `· ${c.hidden}` : ''}
                </p>
              </button>
              <RowTools
                className="w-full justify-end border-t border-line/10 pt-2 sm:w-auto sm:border-0 sm:pt-0"
                onUp={i > 0 ? () => part.update((prev) => moveItem(prev, i, -1)) : null}
                onDown={i < list.length - 1 ? () => part.update((prev) => moveItem(prev, i, 1)) : null}
                onDelete={() => remove(i)}
              >
                <button type="button" className="icon-btn" onClick={() => setEditing(i)} aria-label={c.edit}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setProject(i, { ...project, hidden: !project.hidden })}
                  aria-label={project.hidden ? c.show : c.hide}
                >
                  {project.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </RowTools>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
