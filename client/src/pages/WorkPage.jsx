import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import ProjectCard from '../components/ProjectCard';
import Seo from '../seo/Seo';

/** Every portfolio project, filterable by service (?service=web|odoo|software). */
export default function WorkPage() {
  const { t, lang } = useLanguage();
  const { projects, services = [] } = useContent();
  const [params, setParams] = useSearchParams();
  const active = params.get('service') || '';
  const shown = active ? projects.filter((p) => (p.services || []).includes(active)) : projects;

  const filters = [
    { id: '', label: t.work.filterAll, count: projects.length },
    ...services.map((s) => ({
      id: s.id,
      label: s.title?.[lang] || s.title?.en,
      count: projects.filter((p) => (p.services || []).includes(s.id)).length,
    })),
  ].filter((f) => f.id === '' || f.count > 0);

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo title={t.work.allTitle} description={t.work.allLead} path="/work" lang={lang} />
      <section className="container-site pb-20 pt-8 md:pb-28">
        <p className="kicker">{t.work.kicker}</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-6xl">{t.work.allTitle}</h1>
        <p className="lead">{t.work.allLead}</p>

        <div className="mt-10 flex flex-wrap gap-2" role="tablist">
          {filters.map((f) => (
            <button
              key={f.id || 'all'}
              type="button"
              role="tab"
              aria-selected={active === f.id}
              onClick={() => setParams(f.id ? { service: f.id } : {}, { replace: true })}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active === f.id
                  ? 'border-accent bg-accent text-white'
                  : 'border-line/15 text-ink hover:border-accent/50 hover:text-accent'
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 text-xs ${active === f.id ? 'bg-white/20' : 'bg-line/10 text-muted'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
