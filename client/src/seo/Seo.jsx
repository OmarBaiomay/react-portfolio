import { Helmet } from 'react-helmet-async';
import { SITE, absoluteUrl, pageTitle } from './site';

/**
 * Per-route SEO head tags. Works for Google (JS-capable) and keeps social
 * previews / SPA navigations correct. Pair with static index.html defaults
 * for the first HTML response.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image,
  lang = 'ar',
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const resolvedTitle = pageTitle(title, lang);
  const resolvedDescription =
    description || SITE.description[lang] || SITE.description.ar;
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || SITE.ogImagePath);
  const keywords = (SITE.keywords[lang] || SITE.keywords.ar).join(', ');
  const ogLocale = lang === 'ar' ? 'ar_SA' : 'en_US';
  const ogLocaleAlt = lang === 'ar' ? 'en_US' : 'ar_SA';

  const payloads = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={lang} />
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={keywords} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedTitle} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />
      {SITE.twitterHandle ? (
        <meta name="twitter:site" content={SITE.twitterHandle} />
      ) : null}
      {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ? (
        <meta
          name="google-site-verification"
          content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION}
        />
      ) : null}
      {import.meta.env.VITE_BING_SITE_VERIFICATION ? (
        <meta name="msvalidate.01" content={import.meta.env.VITE_BING_SITE_VERIFICATION} />
      ) : null}

      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="ar" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {payloads.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
