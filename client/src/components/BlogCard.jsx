import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { formatPostDate, pickLang } from '../lib/blog';

export default function BlogCard({ post }) {
  const { t, lang } = useLanguage();
  const title = pickLang(post.title, lang);
  const excerpt = pickLang(post.excerpt, lang);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line/10 bg-elevated/60 transition hover:-translate-y-1 hover:border-accent/40"
    >
      <figure className="aspect-[16/9] overflow-hidden bg-surface">
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                'radial-gradient(ellipse at 30% 20%, rgb(var(--c-accent) / 0.35), transparent 60%), rgb(var(--c-surface))',
            }}
          />
        )}
      </figure>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, lang)}</time>
          {post.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="font-semibold text-accent">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-ink">{title}</h3>
        {excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{excerpt}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-ink transition group-hover:text-accent">
          {t.blog.readMore}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.object,
    excerpt: PropTypes.object,
    coverUrl: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    publishedAt: PropTypes.string,
  }).isRequired,
};
