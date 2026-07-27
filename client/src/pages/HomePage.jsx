import Hero from '../components/Hero';
import Services from '../components/Services';
import Industries from '../components/Industries';
import Work from '../components/Work';
import Pricing from '../components/Pricing';
import Process from '../components/Process';
import TechStack from '../components/TechStack';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePageAnimations } from '../hooks/usePageAnimations';

export default function HomePage() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  usePageAnimations([lang, theme]);

  return (
    <main>
      <Hero />
      <Services />
      <Industries />
      <Work />
      <Pricing />
      <Process />
      <TechStack />
      <About />
      <Testimonials />
      <Contact />
    </main>
  );
}
