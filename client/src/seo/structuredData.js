import { SITE, absoluteUrl } from './site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logoPath),
    email: SITE.email,
    description: SITE.description.en,
    sameAs: SITE.sameAs.length ? SITE.sameAs : undefined,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: SITE.email,
        availableLanguage: ['English', 'Arabic'],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description.en,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: ['en', 'ar'],
  };
}

export function professionalServiceJsonLd(lang = 'en') {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#service`,
    name: SITE.name,
    url: SITE.url,
    image: absoluteUrl(SITE.ogImagePath),
    description: SITE.description[lang] || SITE.description.en,
    email: SITE.email,
    areaServed: [
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Place', name: 'Worldwide remote' },
    ],
    knowsLanguage: ['en', 'ar'],
    provider: { '@id': `${SITE.url}/#organization` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'B-Code services',
      itemListElement: SITE.services.map((service, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Service',
          name: service.name[lang] || service.name.en,
          description: service.description[lang] || service.description.en,
          url: `${SITE.url}/#services`,
        },
      })),
    },
  };
}

export function faqJsonLd(faqs, lang = 'en') {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q[lang] || item.q.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a[lang] || item.a.en,
      },
    })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function creativeWorkJsonLd(project, lang = 'en') {
  if (!project) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title[lang] || project.title.en,
    description: project.summary[lang] || project.summary.en,
    url: absoluteUrl(`/work/${project.slug}`),
    image: absoluteUrl(project.imgSrc),
    dateCreated: project.year ? `${project.year}-01-01` : undefined,
    creator: { '@id': `${SITE.url}/#organization` },
    about: project.stack,
    keywords: (project.tags?.[lang] || project.tags?.en || []).join(', '),
  };
}

export function homeGraphJsonLd(faqs, lang = 'en') {
  const graph = [
    organizationJsonLd(),
    websiteJsonLd(),
    professionalServiceJsonLd(lang),
  ];
  const faq = faqJsonLd(faqs, lang);
  if (faq) graph.push(faq);
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
