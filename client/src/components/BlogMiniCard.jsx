import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { categoryLabel, pickLang } from '../lib/blog';

/** Small horizontal card for the sidebar list. */
export default function BlogMiniCard({ post }) {
  const { t, lang } = useLanguage();
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group grid grid-cols-[7.5rem_1fr] overflow-hidden rounded-2xl border border-line/10 bg-elevated/60 transition hover:border-accent/40"
    >
      <figure className="h-full min-h-[6.5rem] overflow-hidden bg-surface">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
      </figure>
      <div className="p-4">
        <p className="text-[11px] font-semibold text-accent">
          {categoryLabel(post, lang) || null}
          {post.minutes ? (
            <span className="text-muted">
              {' '}
              · {post.minutes[lang] || post.minutes.en} {t.blog.minRead}
            </span>
          ) : null}
        </p>
        <h3 className="mt-1.5 line-clamp-3 font-display text-sm font-semibold leading-snug text-ink transition group-hover:text-accent">
          {pickLang(post.title, lang)}
        </h3>
      </div>
    </Link>
  );
}

BlogMiniCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.object,
    coverUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    categoryName: PropTypes.object,
    minutes: PropTypes.object,
  }).isRequired,
};
