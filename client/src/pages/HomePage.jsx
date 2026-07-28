import Hero from '../components/Hero';
import Manifesto from '../components/Manifesto';
import Services from '../components/Services';
import LazyMount from '../components/LazyMount';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePageAnimations } from '../hooks/usePageAnimations';
import Seo from '../seo/Seo';
import { homeGraphJsonLd } from '../seo/structuredData';
import { SITE } from '../seo/site';
import { faqs } from '../data/faqs';

function SectionFallback({ minHeight = '16rem' }) {
  // Stable block — no pulse animation (avoids paint noise; height reserved for CLS).
  return <div className="w-full bg-bg" style={{ minHeight }} aria-hidden="true" />;
}

export default function HomePage() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  usePageAnimations([lang, theme]);

  return (
    <main>
      <Seo
        lang={lang}
        path="/"
        description={SITE.description[lang] || SITE.description.en}
        jsonLd={homeGraphJsonLd(faqs, lang)}
      />
      <Hero />
      <Manifesto />
      <Services />

      <LazyMount
        id="industries"
        loader={() => import('../components/Industries')}
        fallback={<SectionFallback minHeight="32rem" />}
        minHeight="32rem"
      />

      <LazyMount
        id="portfolio"
        loader={() => import('../components/Work')}
        fallback={<SectionFallback minHeight="44rem" />}
        minHeight="44rem"
      />
      <LazyMount
        id="pricing"
        loader={() => import('../components/Pricing')}
        fallback={<SectionFallback minHeight="56rem" />}
        minHeight="56rem"
      />
      <LazyMount
        id="process"
        loader={() => import('../components/Process')}
        fallback={<SectionFallback minHeight="40rem" />}
        minHeight="40rem"
      />
      <LazyMount
        id="tech"
        loader={() => import('../components/TechStack')}
        fallback={<SectionFallback minHeight="40rem" />}
        minHeight="40rem"
      />
      <LazyMount
        id="about"
        loader={() => import('../components/About')}
        fallback={<SectionFallback minHeight="32rem" />}
        minHeight="32rem"
      />
      <LazyMount
        id="testimonials"
        loader={() => import('../components/Testimonials')}
        fallback={<SectionFallback minHeight="32rem" />}
        minHeight="32rem"
      />
      <LazyMount
        id="faq"
        loader={() => import('../components/Faq')}
        fallback={<SectionFallback minHeight="36rem" />}
        minHeight="36rem"
      />
      <LazyMount
        id="contact"
        loader={() => import('../components/Contact')}
        fallback={<SectionFallback minHeight="56rem" />}
        minHeight="56rem"
      />
    </main>
  );
}
