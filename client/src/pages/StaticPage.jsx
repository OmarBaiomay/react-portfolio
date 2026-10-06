import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { pickLang, renderMarkdown } from '../lib/blog';
import Seo from '../seo/Seo';
import NotFoundPage from './NotFoundPage';

/** A page edited in the dashboard (privacy policy, terms, …), rendered from Markdown. */
export default function StaticPage() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const { pages, loaded } = useContent();
  const page = pages.find((p) => p.slug === slug);
  const body = page ? pickLang(page.body, lang) : '';
  const html = useMemo(() => renderMarkdown(body), [body]);

  if (!page) {
    // A page added in the dashboard is only known once live content has loaded.
    return loaded ? <NotFoundPage /> : <main className="min-h-[80svh] bg-bg pt-28" aria-busy="true" />;
  }

  const title = pickLang(page.title, lang);
  const updated = page.updated
    ? new Date(page.updated).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <main className="bg-bg pt-24 md:pt-28">
      <Seo title={title} description={pickLang(page.description, lang)} path={`/${page.slug}`} lang={lang} />
      <article className="container-site pb-20 pt-8 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">{title}</h1>
          {updated ? (
            <p className="mt-4 text-sm text-muted">
              {lang === 'ar' ? 'آخر تحديث:' : 'Last updated:'} <time dateTime={page.updated}>{updated}</time>
            </p>
          ) : null}
          <div
            className="prose-post mt-10"
            // Markdown is rendered and sanitized in renderMarkdown().
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </article>
    </main>
  );
}
