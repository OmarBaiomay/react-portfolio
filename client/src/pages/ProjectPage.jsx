import { useEffect, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getNextProject, getProjectBySlug } from '../data/projects';
import { useContent } from '../context/ContentContext';
import { BrowserFrame, DeviceStack, PhoneCarousel } from '../components/DeviceMockups';
import Seo from '../seo/Seo';
import { breadcrumbJsonLd, creativeWorkJsonLd } from '../seo/structuredData';

const pad = (n) => String(n).padStart(2, '0');

const ProjectPage = () => {
  const { slug } = useParams();
  const { t, lang, isRtl } = useLanguage();
  const rootRef = useRef(null);
  const { projects, industries, loaded } = useContent();
  const project = getProjectBySlug(slug, projects);

  useEffect(() => {
    if (!project || !rootRef.current) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // fromTo with explicit end values: a re-run mid-tween can't freeze elements at opacity 0.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-project]',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [project, lang]);

  if (!project) {
    // A project added in the dashboard is only known once live content has loaded.
    if (!loaded) return <div className="min-h-[80svh] bg-bg" aria-hidden="true" />;
    return <Navigate to="/#portfolio" replace />;
  }

  const p = t.project;
  const pick = (value) => value[lang] || value.en;
  const industry = industries.find((i) => i.id === project.industry);
  const next = getNextProject(project.slug, projects);
  const index = projects.findIndex((item) => item.slug === project.slug) + 1;
  const title = pick(project.title);
  const summary = pick(project.summary);
  const liveHost = project.liveUrl ? new URL(project.liveUrl).host.replace(/^www\./, '') : null;
  const labelCase = isRtl ? 'tracking-normal' : 'uppercase tracking-[0.2em]';

  const meta = [
    { label: p.client, value: pick(project.client) },
    project.year ? { label: p.year, value: project.year } : null,
    { label: p.role, value: pick(project.role) },
    industry ? { label: p.industry, value: pick(industry.title) } : null,
  ].filter(Boolean);

  const shots = (list = []) => list.map((shot) => ({ src: shot.src, alt: pick(shot.alt) }));
  const gallery = project.gallery
    ? {
        desktop: shots(project.gallery.desktop),
        tablet: shots(project.gallery.tablet),
        mobile: shots(project.gallery.mobile),
      }
    : null;

  const story = [
    { label: p.overview, body: pick(project.overview) },
    { label: p.challenge, body: pick(project.challenge) },
    { label: p.solution, body: pick(project.solution) },
  ];

  return (
    <article ref={rootRef} className="overflow-x-clip bg-bg pt-24 md:pt-28">
      <Seo
        title={title}
        description={summary}
        path={`/work/${project.slug}`}
        image={project.imgSrc}
        lang={lang}
        type="article"
        jsonLd={[
          creativeWorkJsonLd(project, lang),
          breadcrumbJsonLd([
            { name: 'B-Code', path: '/' },
            { name: t.nav.portfolio, path: '/#portfolio' },
            { name: title, path: `/work/${project.slug}` },
          ]),
        ]}
      />

      {/* Intro — text beside the (square) project image, never cropped */}
      <header className="container-site grid items-center gap-10 pb-14 lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:pb-20">
        <div>
          <Link
            to="/#portfolio"
            data-project
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {p.back}
          </Link>

          <p data-project className={`mt-10 font-display text-xs font-semibold text-accent ${labelCase}`}>
            {p.caseStudy} · <bdi dir="ltr">{pad(index)} / {pad(projects.length)}</bdi>
          </p>

          <h1
            data-project
            className={`mt-4 font-display text-5xl font-bold text-ink md:text-7xl ${
              isRtl ? 'leading-[1.2]' : 'leading-[0.95] tracking-tight'
            }`}
          >
            {title}
          </h1>

          <p data-project className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            {summary}
          </p>

          <ul data-project className="mt-6 flex flex-wrap gap-2">
            {project.tags[lang].map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-line/15 px-3 py-1 text-xs font-semibold text-ink"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div data-project className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary group !px-6 !py-3.5 text-base"
              >
                {p.visitLive}
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : null}
            <Link to="/#contact" className="btn-ghost !px-6 !py-3.5 text-base">
              {p.ctaSimilar}
            </Link>
          </div>
        </div>

        <figure data-project className="device-shot relative">
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-accent/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-line/10 bg-elevated shadow-card">
            <img
              src={project.imgSrc}
              alt={title}
              draggable="false"
              width="1200"
              height="1200"
              className="aspect-square w-full object-cover"
            />
          </div>
        </figure>
      </header>

      {/* Facts strip */}
      <section className="border-y border-line/10">
        <dl
          className={`container-site grid grid-cols-2 ${
            meta.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}
        >
          {meta.map((item, i) => (
            <div
              key={item.label}
              data-project
              className={[
                'border-line/10 py-6 pe-4 lg:py-8',
                // mobile: 2×2 grid; desktop: one row with dividers
                i % 2 === 1 ? 'border-s ps-5' : '',
                i > 1 ? 'border-t lg:border-t-0' : '',
                i > 0 ? 'lg:border-s lg:ps-8' : '',
              ].join(' ')}
            >
              <dt className={`text-[11px] font-semibold text-muted ${labelCase}`}>{item.label}</dt>
              <dd className="mt-2 font-display text-base font-semibold text-ink md:text-lg">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* The story — numbered editorial rows */}
      <section className="container-site py-16 md:py-24">
        {story.map((row, i) => (
          <div
            key={row.label}
            data-project
            className="grid gap-4 border-t border-line/10 py-10 first:border-t-0 first:pt-0 md:grid-cols-[16rem_1fr] md:gap-12"
          >
            <h2 className="flex items-baseline gap-4 font-display text-2xl font-semibold text-ink">
              <span className="font-mono text-sm text-accent">{pad(i + 1)}</span>
              {row.label}
            </h2>
            <p className="max-w-3xl text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
              {row.body}
            </p>
          </div>
        ))}
      </section>

      {/* Screens — real screenshots in device frames */}
      {gallery ? (
        <section className="border-t border-line/10 py-16 md:py-24">
          <div className="container-site">
            <div data-project className="mx-auto max-w-2xl text-center">
              <p className={`font-display text-xs font-semibold text-accent ${labelCase}`}>
                {p.galleryKicker}
              </p>
              <h2 className="title mt-3">{p.galleryTitle}</h2>
              <p className="lead mx-auto">{p.galleryLead}</p>
            </div>

            <div data-project className="mx-auto mt-12 max-w-5xl md:mt-16">
              <DeviceStack
                desktop={gallery.desktop[0]}
                tablet={gallery.tablet[0]}
                phone={gallery.mobile[0]}
                host={liveHost}
              />
            </div>

            {gallery.desktop.length > 1 ? (
              <div className="mt-20 md:mt-28">
                <h3 data-project className={`text-xs font-semibold text-muted ${labelCase}`}>
                  {p.desktop}
                </h3>
                <div
                  className={`mt-6 grid gap-6 md:gap-8 ${
                    gallery.desktop.length - 1 === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
                  }`}
                >
                  {gallery.desktop.slice(1).map((shot) => (
                    <BrowserFrame key={shot.src} {...shot} host={liveHost} className="w-full" />
                  ))}
                </div>
              </div>
            ) : null}

            {gallery.mobile.length > 0 ? (
              <div className="mt-16 md:mt-24">
                <h3 data-project className={`text-xs font-semibold text-muted ${labelCase}`}>
                  {p.mobile}
                </h3>
                <div className="mt-6">
                  <PhoneCarousel
                    shots={gallery.mobile}
                    labels={{ prev: p.prevScreen, next: p.nextScreen, swipe: p.swipeHint }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Results + stack */}
      <section className="bg-elevated/40 py-16 md:py-24">
        <div className="container-site">
          <h2 data-project className="title">
            {p.results}
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {project.results[lang].map((item) => (
              <li
                key={item}
                data-project
                className="flex gap-4 rounded-2xl border border-line/10 bg-bg/60 p-6"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-base font-medium leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ol>

          <div data-project className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <h3 className={`shrink-0 text-xs font-semibold text-muted ${labelCase}`}>{p.stack}</h3>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-line/15 bg-bg/60 px-3 py-1.5 font-mono text-sm text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-16 md:py-24">
        <div
          data-project
          className="relative overflow-hidden rounded-3xl border border-accent/25 bg-accent/10 px-6 py-12 text-center md:px-12 md:py-16"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgb(var(--c-accent) / 0.25), transparent 65%)',
            }}
            aria-hidden="true"
          />
          <h2 className="relative font-display text-3xl font-bold text-ink md:text-5xl">
            {p.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-muted md:text-lg">
            {p.ctaLead}
          </p>
          <Link to="/#contact" className="btn-primary group relative mt-8 !px-7 !py-4 text-base">
            {p.ctaSimilar}
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Next project */}
      {next ? (
        <Link
          to={`/work/${next.slug}`}
          className="group block border-t border-line/10 transition hover:bg-elevated/40"
        >
          <div className="container-site flex items-center gap-6 py-12 md:gap-10 md:py-16">
            <img
              src={next.imgSrc}
              alt=""
              loading="lazy"
              width="1200"
              height="1200"
              className="h-20 w-20 shrink-0 rounded-2xl border border-line/10 object-cover transition duration-500 group-hover:scale-105 md:h-28 md:w-28"
            />
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold text-accent ${labelCase}`}>{p.nextProject}</p>
              <p dir="auto" className="mt-2 truncate font-display rtl:text-right text-3xl font-bold text-ink md:text-5xl">
                {pick(next.title)}
              </p>
              <p dir="auto" className="mt-2 hidden truncate text-muted rtl:text-right md:block">{pick(next.summary)}</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line/15 text-ink transition group-hover:border-accent group-hover:bg-accent group-hover:text-white md:h-16 md:w-16">
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5 rtl:rotate-180 md:h-6 md:w-6" />
            </span>
          </div>
        </Link>
      ) : null}
    </article>
  );
};

export default ProjectPage;
