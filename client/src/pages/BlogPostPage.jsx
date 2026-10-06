import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, ChevronRight, Clock, Link2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicAPI } from '../services/frontendApi';
import BlogCard from '../components/BlogCard';
import BlogMiniCard from '../components/BlogMiniCard';
import { categoryLabel, formatPostDate, pickLang, readingMinutes, renderMarkdown } from '../lib/blog';
import { absoluteUrl } from '../seo/site';
import Seo from '../seo/Seo';
import { breadcrumbJsonLd, faqJsonLd } from '../seo/structuredData';

function ShareBar({ url, title, labels }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);
  const targets = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${text}%20${link}`, short: 'WA' },
    { name: 'X', href: `https://x.com/intent/post?text=${text}&url=${link}`, short: 'X' },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`, short: 'in' },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };
  const btn =
    'grid h-9 min-w-9 place-items-center rounded-full border border-line/15 px-2.5 text-xs font-bold text-ink transition hover:border-accent hover:text-accent';

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
      <span className="me-1 text-xs font-semibold text-muted">{labels.share}</span>
      {targets.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className={btn}>
          {s.short}
        </a>
      ))}
      <button type="button" onClick={copy} aria-label={labels.copyLink} className={btn}>
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Link2 className="h-4 w-4" />}
      </button>
      <span className={`text-xs text-accent transition ${copied ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
        {copied ? labels.linkCopied : ''}
      </span>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t, lang } = useLanguage();
  const b = t.blog;
  // undefined = loading, null = not found
  const [post, setPost] = useState(undefined);
  const [others, setOthers] = useState([]);

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

  // Other posts feed the sidebar and the related section.
  useEffect(() => {
    let alive = true;
    publicAPI
      .getBlogPosts()
      .then(({ data }) => alive && setOthers(Array.isArray(data) ? data : []))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const body = post ? pickLang(post.body, lang) : '';
  const html = useMemo(() => renderMarkdown(body), [body]);

  const { related, more } = useMemo(() => {
    const rest = others.filter((p) => p.slug !== slug);
    // Same category counts most, shared tags break ties.
    const tags = new Set(post?.tags || []);
    const score = (p) =>
      (post?.category && p.category === post.category ? 3 : 0) + (p.tags || []).filter((tag) => tags.has(tag)).length;
    const rel = rest
      .filter((p) => score(p) > 0)
      .sort((a, c) => score(c) - score(a))
      .slice(0, 3);
    return { related: rel, more: rest.filter((p) => !rel.includes(p)).slice(0, 3) };
  }, [others, post, slug]);

  if (post === undefined) {
    return <main className="min-h-[80svh] bg-bg pt-28" aria-busy="true" />;
  }

  if (post === null) {
    return (
      <main className="container-site min-h-[70svh] bg-bg pb-20 pt-32 text-center">
        <p className="text-lg text-muted">{b.notFound}</p>
        <Link to="/blog" className="btn-primary mt-8">
          {b.back}
        </Link>
      </main>
    );
  }

  const title = pickLang(post.title, lang);
  const excerpt = pickLang(post.excerpt, lang);
  // Search snippet: dedicated SEO fields when set, otherwise the title and excerpt.
  const seoTitle = pickLang(post.seo?.title, lang) || title;
  const seoDescription = pickLang(post.seo?.description, lang) || excerpt;
  const faq = (post.faq || []).filter((item) => pickLang(item.q, lang) && pickLang(item.a, lang));
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const sidebarPosts = more.length ? more : related;

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={`/blog/${post.slug}`}
        image={post.coverUrl || undefined}
        lang={lang}
        type="article"
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'B-Code', path: '/' },
            { name: b.kicker, path: '/blog' },
            { name: title, path: `/blog/${post.slug}` },
          ]),
          faq.length ? faqJsonLd(faq, lang) : null,
        ]}
      />

      <div className="container-site grid gap-12 pb-20 pt-6 md:pb-28 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="min-w-0">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link to="/" className="transition hover:text-accent">
              {b.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            <Link to="/blog" className="transition hover:text-accent">
              {b.kicker}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            <span className="line-clamp-1 max-w-[16rem] text-ink">{title}</span>
          </nav>

          {post.coverUrl ? (
            <figure className="mt-5 overflow-hidden rounded-3xl border border-line/10">
              <img src={post.coverUrl} alt="" className="aspect-[16/10] w-full object-cover md:aspect-[16/9]" />
            </figure>
          ) : null}

          {/* Centred on phones (app-style), aligned to the text edge on larger screens */}
          <header className="mt-6 text-center md:mt-8 md:text-start">
            {categoryLabel(post, lang) ? (
              <Link
                to={post.category ? `/blog?category=${encodeURIComponent(post.category)}` : '/blog'}
                className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent hover:text-white"
              >
                {categoryLabel(post, lang)}
              </Link>
            ) : null}

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
              {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:justify-start">
              {post.author ? (
                <span className="inline-flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-white">
                    {post.author.trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-ink">{post.author}</span>
                </span>
              ) : null}
              <span className="flex items-center gap-3 text-sm text-muted">
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, lang)}</time>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingMinutes(body)} {b.minRead}
                </span>
              </span>
            </div>

            <div className="mt-5 border-y border-line/10 py-3">
              <ShareBar url={pageUrl} title={title} labels={b} />
            </div>

            {excerpt ? <p className="mt-6 text-base leading-relaxed text-muted md:text-xl">{excerpt}</p> : null}
          </header>

          <div
            className="prose-post mt-10"
            // Markdown is rendered and sanitized in renderMarkdown().
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {faq.length ? (
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">{b.faqTitle}</h2>
              <div className="mt-6 divide-y divide-line/10 rounded-2xl border border-line/10">
                {faq.map((item) => (
                  <details key={pickLang(item.q, lang)} className="group px-5 py-4 md:px-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                      {pickLang(item.q, lang)}
                      <span className="text-xl leading-none text-accent transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted">{pickLang(item.a, lang)}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* Author */}
          {post.author ? (
            <section className="mt-12 flex gap-4 rounded-2xl border border-accent/25 bg-accent/5 p-5 md:p-6">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent text-xl font-bold text-white">
                {post.author.trim().charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-xs font-semibold text-accent">{b.writtenBy}</p>
                <p className="font-display text-lg font-bold text-ink">{post.author}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{b.authorBio}</p>
              </div>
            </section>
          ) : null}

          {/* Related */}
          {related.length ? (
            <section className="mt-16">
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">{b.related}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {related.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          ) : null}
        </article>

        {/* Sidebar: stays in view on large screens, follows the article on phones */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-4">
            {sidebarPosts.length ? (
              <>
                <h2 className="font-display text-lg font-bold text-ink">{b.moreArticles}</h2>
                {sidebarPosts.map((p) => (
                  <BlogMiniCard key={p.id} post={p} />
                ))}
              </>
            ) : null}
            <div className="rounded-2xl border border-accent/25 bg-accent/10 p-6">
              <p className="font-display text-lg font-bold text-ink">{b.sideCtaTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b.sideCtaLead}</p>
              <Link to="/#contact" className="btn-primary group mt-4 !px-5 !py-2.5 text-sm">
                {b.sideCtaButton}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

ShareBar.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  labels: PropTypes.object.isRequired,
};
