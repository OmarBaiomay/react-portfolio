import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

/** Portfolio card used on the home page, /work and service pages. */
export default function ProjectCard({ project, ...rest }) {
  const { t, lang } = useLanguage();
  return (
    <Link
      to={`/work/${project.slug}`}
      className="group glass overflow-hidden rounded-2xl transition hover:border-accent/40 hover:shadow-glow"
      {...rest}
    >
      <figure className="aspect-[16/10] overflow-hidden bg-surface">
        <img
          src={project.imgSrc}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </figure>
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {(project.tags?.[lang] || []).map((tag) => (
            <span key={tag} className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold">{project.title?.[lang] || project.title?.en}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary?.[lang] || project.summary?.en}</p>
        <span className="mt-4 inline-flex text-sm font-semibold text-ink transition group-hover:text-accent">
          {t.cta.viewProject} →
        </span>
      </div>
    </Link>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    imgSrc: PropTypes.string,
    tags: PropTypes.object,
    title: PropTypes.object,
    summary: PropTypes.object,
  }).isRequired,
};
