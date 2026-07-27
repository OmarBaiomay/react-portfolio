/** Canonical site identity for SEO + AI search (AIEO / GEO). */
export const SITE = {
  name: 'B-Code',
  legalName: 'B-Code',
  url: 'https://b-code.tech',
  localeDefault: 'ar_SA',
  localeAlternate: 'en_US',
  languageDefault: 'ar',
  email: 'baiomayomar@gmail.com',
  sameAs: [
    'https://github.com/OmarBaiomay',
    'https://www.linkedin.com/in/omar-albayoumi/',
  ],
  logoPath: '/images/logo.svg',
  /** 1200×630 social share image */
  ogImagePath: '/images/og-cover.png',
  twitterHandle: '',
  description: {
    en: 'B-Code builds modern websites, Odoo ERP systems, and custom software for companies that need reliable technology and clear results.',
    ar: 'بي‑كود تبني مواقع إلكترونية حديثة وأنظمة أودو وحلولاً برمجية مخصصة للشركات التي تحتاج تقنية موثوقة ونتائج واضحة.',
  },
  tagline: {
    en: 'Web, Odoo & Software Solutions',
    ar: 'حلول الويب وأودو والبرمجيات',
  },
  keywords: {
    en: [
      'B-Code',
      'web development',
      'Odoo development',
      'Odoo ERP',
      'custom software',
      'React development',
      'company website',
      'software agency',
    ],
    ar: [
      'بي-كود',
      'تطوير مواقع',
      'تطوير أودو',
      'أنظمة ERP',
      'برمجيات مخصصة',
      'شركة برمجيات',
    ],
  },
  services: [
    {
      id: 'web',
      name: { en: 'Web Development', ar: 'تطوير الويب' },
      description: {
        en: 'High-performance marketing sites and web apps engineered for conversion, speed, and maintainability.',
        ar: 'مواقع وتطبيقات ويب عالية الأداء مصمّمة للتحويل والسرعة وسهولة الصيانة.',
      },
    },
    {
      id: 'odoo',
      name: { en: 'Odoo Development', ar: 'تطوير أنظمة أودو' },
      description: {
        en: 'Odoo ERP implementation, customization, and integrations that match real business workflows.',
        ar: 'تنفيذ وتخصيص وتكامل أنظمة أودو بما يتوافق مع سير العمل الحقيقي للأعمال.',
      },
    },
    {
      id: 'software',
      name: { en: 'Custom Software', ar: 'البرمجيات المخصصة' },
      description: {
        en: 'Bespoke software systems built around your process — APIs, dashboards, and internal tools.',
        ar: 'أنظمة برمجية مخصصة تُبنى حول عملياتك — واجهات برمجية ولوحات تحكم وأدوات داخلية.',
      },
    },
  ],
};

export function absoluteUrl(path = '/') {
  if (!path) return SITE.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageTitle(title, lang = 'ar') {
  const brand = SITE.name;
  const tag = SITE.tagline[lang] || SITE.tagline.ar;
  if (!title) return `${brand} | ${tag}`;
  return `${title} | ${brand}`;
}
