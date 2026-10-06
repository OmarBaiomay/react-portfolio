import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import { formatPostDate, pickLang, readingMinutes, renderMarkdown } from '../lib/blog';
import Seo from '../seo/Seo';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  // undefined = loading, null = not found
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    let alive = true;
    setPost(undefined);
    publicAPI
      .getBlogPost(slug)
      .then(({ data }) => alive && setPost(data))
      .catch(() => alive && setPost(null));
    return () => {
      alive = false;
    };
  }, [slug]);

  const body = post ? pickLang(post.body, lang) : '';
  const html = useMemo(() => renderMarkdown(body), [body]);

  if (post === undefined) {
    return <main className="min-h-[80svh] bg-bg pt-28" aria-busy="true" />;
  }

  if (post === null) {
    return (
      <main className="container-site min-h-[70svh] bg-bg pb-20 pt-32 text-center">
        <p className="text-lg text-muted">{t.blog.notFound}</p>
        <Link to="/blog" className="btn-primary mt-8">
          {t.blog.back}
        </Link>
      </main>
    );
  }

  const title = pickLang(post.title, lang);
  const excerpt = pickLang(post.excerpt, lang);

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo
        title={title}
        description={excerpt}
        path={`/blog/${post.slug}`}
        image={post.coverUrl || undefined}
        lang={lang}
        type="article"
      />
      <article className="container-site pb-20 pt-8 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t.blog.back}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, lang)}</time>
            <span aria-hidden="true">·</span>
            <span>
              {readingMinutes(body)} {t.blog.minRead}
            </span>
            {post.author ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.author}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          {excerpt ? <p className="mt-5 text-lg leading-relaxed text-muted md:text-xl">{excerpt}</p> : null}

          {post.tags?.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line/15 px-3 py-1 text-xs font-semibold text-ink">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {post.coverUrl ? (
          <figure className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-line/10">
            <img src={post.coverUrl} alt="" className="aspect-[16/9] w-full object-cover" />
          </figure>
        ) : null}

        <div
          className="prose-post mx-auto mt-12 max-w-3xl"
          // Markdown is rendered and sanitized in renderMarkdown().
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-accent/25 bg-accent/10 p-8 text-center md:p-10">
          <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">{t.project.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">{t.project.ctaLead}</p>
          <a href="/#contact" className="btn-primary group mt-6">
            {t.cta.start}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
          </a>
        </div>
      </article>
    </main>
  );
}
