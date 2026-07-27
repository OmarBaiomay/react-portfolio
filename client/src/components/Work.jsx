import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { projects } from '../data/projects';

const Work = () => {
  const { t, lang } = useLanguage();

  return (
    <section id="portfolio" className="section">
      <div className="container-site">
        <div
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          data-animate="fade-up"
        >
          <div>
            <p className="kicker">{t.work.kicker}</p>
            <h2 className="title">{t.work.title}</h2>
            <p className="lead">{t.work.lead}</p>
          </div>
          <a href="/#contact" className="btn-ghost shrink-0">
            {t.cta.startYours}
          </a>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2" data-animate="stagger">
          {projects.map((work) => (
            <Link
              key={work.slug}
              to={`/work/${work.slug}`}
              data-animate-child
              className="group glass overflow-hidden rounded-2xl transition hover:border-accent/40 hover:shadow-glow"
            >
              <figure className="aspect-[16/10] overflow-hidden bg-surface">
                <img
                  src={work.imgSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </figure>
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {work.tags[lang].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold uppercase tracking-wider text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold">
                  {work.title[lang]}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {work.summary[lang]}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-ink transition group-hover:text-accent">
                  {t.cta.viewProject} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
