import PropTypes from 'prop-types';

const ProjectCard = ({ imgSrc, title, tags, projectLink, summary, classes = '' }) => {
  return (
    <a
      href={projectLink}
      target="_blank"
      rel="noreferrer"
      className={`group block overflow-hidden border border-ink/10 bg-paper-card transition hover:border-accent/40 ${classes}`}
    >
      <figure className="aspect-[16/10] overflow-hidden bg-ink/5">
        <img
          src={imgSrc}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </figure>
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold uppercase tracking-wider text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold text-ink">{title}</h3>
        {summary ? (
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{summary}</p>
        ) : null}
        <span className="mt-4 inline-flex text-sm font-semibold text-ink transition group-hover:text-accent">
          View project →
        </span>
      </div>
    </a>
  );
};

ProjectCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectLink: PropTypes.string.isRequired,
  summary: PropTypes.string,
  classes: PropTypes.string,
};

export default ProjectCard;
