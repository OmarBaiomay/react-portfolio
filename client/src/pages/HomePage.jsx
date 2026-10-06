import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import Services from '../components/Services';
import LazyMount from '../components/LazyMount';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import { usePageAnimations } from '../hooks/usePageAnimations';
import Seo from '../seo/Seo';
import { homeGraphJsonLd } from '../seo/structuredData';

function SectionFallback({ minHeight = '16rem' }) {
  // Stable block — no pulse animation (avoids paint noise; height reserved for CLS).
  return <div className="w-full bg-bg" style={{ minHeight }} aria-hidden="true" />;
}

/** Above-the-fold sections render eagerly; the rest mount near the viewport. */
const EAGER = {
  manifesto: Manifesto,
  services: Services,
};

const LAZY = {
  industries: { loader: () => import('../components/Industries'), minHeight: '32rem' },
  portfolio: { loader: () => import('../components/Work'), minHeight: '44rem' },
  pricing: { loader: () => import('../components/Pricing'), minHeight: '56rem' },
  process: { loader: () => import('../components/Process'), minHeight: '40rem' },
  tech: { loader: () => import('../components/TechStack'), minHeight: '40rem' },
  about: { loader: () => import('../components/About'), minHeight: '32rem' },
  testimonials: { loader: () => import('../components/Testimonials'), minHeight: '32rem' },
  blog: { loader: () => import('../components/BlogTeaser'), minHeight: '8rem' },
  faq: { loader: () => import('../components/Faq'), minHeight: '36rem' },
  contact: { loader: () => import('../components/Contact'), minHeight: '56rem' },
};

export default function HomePage() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { sections, faqs, site } = useContent();
  usePageAnimations([lang, theme]);

  return (
    <main>
      <Seo
        lang={lang}
        path="/"
        description={site.seo?.description?.[lang] || site.seo?.description?.en}
        jsonLd={homeGraphJsonLd(faqs, lang)}
      />
      <Hero />

      {sections
        .filter((section) => section.visible !== false)
        .map(({ id }) => {
          const Eager = EAGER[id];
          if (Eager) return <Eager key={id} />;
          const lazy = LAZY[id];
          if (!lazy) return null;
          return (
            <LazyMount
              key={id}
              id={id}
              loader={lazy.loader}
              fallback={<SectionFallback minHeight={lazy.minHeight} />}
              minHeight={lazy.minHeight}
            />
          );
        })}
    </main>
  );
}
