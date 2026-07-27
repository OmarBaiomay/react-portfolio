import { useEffect, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProjectBySlug, getRelatedProjects } from '../data/projects';
import { industries } from '../data/industries';

const ProjectPage = () => {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const rootRef = useRef(null);
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!project || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-project]', {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, rootRef);
    return () => ctx.revert();
  }, [project, lang, slug]);

  if (!project) {
    return <Navigate to="/#portfolio" replace />;
  }

  const industry = industries.find((i) => i.id === project.industry);
  const related = getRelatedProjects(project.slug, 2);
  const p = t.project;

  return (
    <div ref={rootRef} className="bg-bg pt-24 md:pt-28">
      <section className="container-site pb-10">
        <Link
          to="/#portfolio"
          data-project
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {p.back}
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div data-project className="flex flex-wrap gap-2">
              {project.tags[lang].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent"
                >
                  {tag}
                </span>
              ))}
              {industry ? (
                <span className="rounded-md border border-line/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {industry.title[lang]}
                </span>
              ) : null}
            </div>
            <h1
              data-project
              className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl"
            >
              {project.title[lang]}
            </h1>
            <p data-project className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {project.summary[lang]}
            </p>
            <div data-project className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  {p.visitLive}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
              <a href="/#contact" className="btn-ghost">
                {t.cta.start}
              </a>
            </div>
          </div>

          <dl
            data-project
            className="glass grid grid-cols-2 gap-4 rounded-2xl p-5 md:p-6"
          >
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">{p.client}</dt>
              <dd className="mt-1 font-semibold">{project.client[lang]}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">{p.year}</dt>
              <dd className="mt-1 font-semibold">{project.year}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wider text-muted">{p.role}</dt>
              <dd className="mt-1 font-semibold">{project.role[lang]}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-site pb-16" data-project>
        <figure className="overflow-hidden rounded-2xl border border-line/10">
          <img
            src={project.imgSrc}
            alt={project.title[lang]}
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>
      </section>

      <section className="container-site grid gap-10 pb-16 lg:grid-cols-3">
        <article data-project className="glass rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-display text-xl font-semibold">{p.overview}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {project.overview[lang]}
          </p>
        </article>
        <article data-project className="glass rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-display text-xl font-semibold">{p.challenge}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {project.challenge[lang]}
          </p>
        </article>
        <article data-project className="glass rounded-2xl p-6 lg:col-span-1">
          <h2 className="font-display text-xl font-semibold">{p.solution}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
            {project.solution[lang]}
          </p>
        </article>
      </section>

      <section className="container-site grid gap-8 pb-16 md:grid-cols-2">
        <div data-project className="rounded-2xl border border-line/10 bg-elevated/40 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold">{p.results}</h2>
          <ul className="mt-5 space-y-3">
            {project.results[lang].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted md:text-base">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div data-project className="rounded-2xl border border-line/10 bg-elevated/40 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold">{p.stack}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-line/15 bg-bg/50 px-3 py-1.5 text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
          <a href="/#contact" className="btn-primary mt-8">
            {p.ctaSimilar}
          </a>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-line/10 bg-elevated/30 py-16">
          <div className="container-site">
            <h2 data-project className="font-display text-2xl font-semibold md:text-3xl">
              {p.related}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to={`/work/${item.slug}`}
                  data-project
                  className="group glass overflow-hidden rounded-2xl transition hover:border-accent/40"
                >
                  <img
                    src={item.imgSrc}
                    alt=""
                    className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{item.title[lang]}</h3>
                    <p className="mt-2 text-sm text-muted">{item.summary[lang]}</p>
                    <span className="mt-3 inline-flex text-sm font-semibold text-accent">
                      {t.cta.viewProject} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ProjectPage;
