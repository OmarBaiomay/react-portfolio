import Hero from '../components/Hero';
import Services from '../components/Services';
import Industries from '../components/Industries';
import Work from '../components/Work';
import Pricing from '../components/Pricing';
import Process from '../components/Process';
import TechStack from '../components/TechStack';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import Contact from '../components/Contact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePageAnimations } from '../hooks/usePageAnimations';
import Seo from '../seo/Seo';
import { homeGraphJsonLd } from '../seo/structuredData';
import { SITE } from '../seo/site';
import { faqs } from '../data/faqs';

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
      <Services />
      <Industries />
      <Work />
      <Pricing />
      <Process />
      <TechStack />
      <About />
      <Testimonials />
      <Faq />
      <Contact />
    </main>
  );
}
