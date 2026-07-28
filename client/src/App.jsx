import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { BrandProvider } from './context/BrandContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { scrollToSectionId } from './hooks/useScrollToSection';

const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const LenisBoot = lazy(() => import('./components/LenisBoot'));

function getLenis() {
  return typeof window !== 'undefined' ? window.__bcodeLenis || null : null;
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const t = window.setTimeout(() => scrollToSectionId(id, getLenis()), 120);
      return () => window.clearTimeout(t);
    }
    if (pathname !== '/') {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function RouteFallback() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <div
      className={`w-full bg-bg ${isHome ? 'min-h-[360vh]' : 'min-h-[70svh]'}`}
      aria-hidden="true"
    />
  );
}

function DeferredFooter() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let idleId = 0;
    let timeoutId = 0;
    const show = () => setVisible(true);

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(show, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(show, 400);
    }
    const hard = window.setTimeout(show, 2200);

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && idleId) {
        window.cancelIdleCallback(idleId);
      }
      window.clearTimeout(timeoutId);
      window.clearTimeout(hard);
    };
  }, []);

  if (!visible) {
    return <div className="min-h-[22rem] w-full bg-elevated" aria-hidden="true" />;
  }
  return <Footer />;
}

function AppShell() {
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    // Boot Lenis after first paint / idle — never mid-scroll (that felt broken).
    let idleId = 0;
    let timeoutId = 0;
    const enable = () => setSmooth(true);

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 3500 });
    } else {
      timeoutId = window.setTimeout(enable, 1200);
    }
    const hard = window.setTimeout(enable, 4000);

    return () => {
      if (typeof window.cancelIdleCallback === 'function' && idleId) {
        window.cancelIdleCallback(idleId);
      }
      window.clearTimeout(timeoutId);
      window.clearTimeout(hard);
    };
  }, []);

  return (
    <>
      {smooth ? (
        <Suspense fallback={null}>
          <LenisBoot />
        </Suspense>
      ) : null}
      <ScrollToHash />
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <DeferredFooter />
    </>
  );
}

const App = () => (
  <ThemeProvider>
    <BrandProvider>
      <LanguageProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppShell />
        </BrowserRouter>
      </LanguageProvider>
    </BrandProvider>
  </ThemeProvider>
);

export default App;
