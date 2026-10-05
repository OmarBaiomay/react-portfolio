import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Boxes, Check, Code2, Cpu, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { pickLang, renderMarkdown } from '../lib/blog';
import ProjectCard from '../components/ProjectCard';
import Seo from '../seo/Seo';
import NotFoundPage from './NotFoundPage';

const ICONS = { Code2, Boxes, Cpu };

/** /services/:slug — one service with its image, description and related projects. */
export default function ServicePage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const { services = [], projects, loaded } = useContent();
  const service = services.find((s) => s.slug === slug);
  const body = service ? pickLang(service.body, lang) : '';
  const html = useMemo(() => renderMarkdown(body), [body]);

  if (!service) {
    return loaded ? <NotFoundPage /> : <main className="min-h-[80svh] bg-bg pt-28" aria-busy="true" />;
  }

  const S = t.servicePage;
  const title = pickLang(service.title, lang);
  const Icon = ICONS[service.icon] || Sparkles;
  const related = projects.filter((p) => (p.services || []).includes(service.id));
  const others = services.filter((s) => s.slug !== service.slug);
  const highlights = service.highlights?.[lang] || service.highlights?.en || [];

  return (
    <main className="overflow-x-clip bg-bg pt-24 md:pt-28">
      <Seo title={title} description={pickLang(service.tagline, lang)} path={`/services/${service.slug}`} image={service.image} lang={lang} />

      <header className="container-site grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <p className="kicker inline-flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {t.services.kicker}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted md:text-xl">{pickLang(service.tagline, lang)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/#contact" className="btn-primary group !px-6 !py-3.5 text-base">
              {S.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
            </a>
            {related.length ? (
              <a href="#related" className="btn-ghost !px-6 !py-3.5 text-base">
                {S.seeWork}
              </a>
            ) : null}
          </div>
        </div>
        {service.image ? (
          <figure className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent/15 blur-3xl" />
            <img
              src={service.image}
              alt={title}
              width="1600"
              height="900"
              className="relative aspect-[16/9] w-full rounded-3xl border border-line/10 object-cover shadow-card"
            />
          </figure>
        ) : null}
      </header>

      {highlights.length ? (
        <section className="border-y border-line/10 bg-elevated/40">
          <div className="container-site py-12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{S.includes}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 rounded-xl border border-line/10 bg-bg/60 px-4 py-3 text-sm font-medium text-ink">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="container-site py-16 md:py-20">
        <div
          className="prose-post mx-auto max-w-3xl"
          // Markdown is rendered and sanitized in renderMarkdown().
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      {related.length ? (
        <section id="related" className="scroll-mt-28 border-t border-line/10 py-16 md:py-20">
          <div className="container-site">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="kicker">{t.work.kicker}</p>
                <h2 className="title">{S.related}</h2>
              </div>
              <Link to={`/work?service=${service.id}`} className="btn-ghost shrink-0">
                {t.work.viewAll}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {others.length ? (
        <section className="border-t border-line/10 py-16">
          <div className="container-site">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{S.other}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {others.map((s) => {
                const OtherIcon = ICONS[s.icon] || Sparkles;
                return (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="glass group flex min-w-0 items-center gap-4 rounded-2xl p-5 transition hover:border-accent/40"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                      <OtherIcon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold text-ink">{pickLang(s.title, lang)}</span>
                      <span className="block truncate text-sm text-muted">{pickLang(s.tagline, lang)}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent rtl:rotate-180" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
