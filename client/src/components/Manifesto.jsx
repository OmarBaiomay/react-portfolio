import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cacheManifesto, readCachedManifesto } from '../lib/appearanceCache';
import { getBootstrappedManifesto } from '../lib/bootstrapAppearance';
import { useHeavyVisuals } from '../hooks/useHeavyVisuals';

const FloatingField = lazy(() => import('./FloatingField'));

function DeferredFloatingField({ scrollProgressRef }) {
  const ready = useHeavyVisuals({ timeoutMs: 12000 });
  if (!ready) {
    return <div className="h-full w-full bg-bg" aria-hidden="true" />;
  }
  return (
    <Suspense fallback={<div className="h-full w-full bg-bg" aria-hidden="true" />}>
      <FloatingField scrollProgressRef={scrollProgressRef} />
    </Suspense>
  );
}

/** Parse "text **glow** more" into plain / accent segments */
function parseLine(line) {
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match = re.exec(line);
  while (match) {
    if (match.index > last) {
      parts.push({ text: line.slice(last, match.index), accent: false });
    }
    parts.push({ text: match[1], accent: true });
    last = match.index + match[0].length;
    match = re.exec(line);
  }
  if (last < line.length) {
    parts.push({ text: line.slice(last), accent: false });
  }
  return parts;
}

function mapToRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function pickI18n(value, lang) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || value.ar || '';
}

export default function Manifesto() {
  const { t, lang, isRtl } = useLanguage();
  const rootRef = useRef(null);
  const contentRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const [manifesto, setManifesto] = useState(() => readCachedManifesto());
  const visualsReady = useHeavyVisuals({ timeoutMs: 12000 });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getBootstrappedManifesto();
        if (!alive || !data) return;
        cacheManifesto(data);
        setManifesto(data);
      } catch {
        // fall back to cache / i18n defaults below
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const kicker = manifesto
    ? pickI18n(manifesto.kicker, lang)
    : t.manifesto?.kicker || '';

  const lines = useMemo(() => {
    if (manifesto?.lines?.length) {
      return manifesto.lines.map((line) => parseLine(pickI18n(line, lang)));
    }
    const fallback = Array.isArray(t.manifesto?.lines) ? t.manifesto.lines : [];
    return fallback.map(parseLine);
  }, [manifesto, t, lang]);

  // Lightweight scroll progress without GSAP (keeps gsap off the critical path).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
      scrollProgressRef.current?.(progress);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [lines.length]);

  // Glow brightness — only after user interaction (same gate as Three).
  useEffect(() => {
    if (!visualsReady || !lines.length) return undefined;
    let cancelled = false;
    let triggers = [];

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const content = contentRef.current;
      if (!content) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      content.querySelectorAll('[data-glow]').forEach((span, index) => {
        const st = ScrollTrigger.create({
          id: `manifesto-glow-${index}`,
          trigger: span,
          start: 'top 90%',
          end: 'bottom 10%',
          onUpdate: (self) => {
            const dist = Math.abs(self.progress - 0.5);
            const brightness = mapToRange(dist, 0, 0.5, 0.88, 1.28);
            span.style.setProperty('--glow-bright', String(brightness));
          },
        });
        triggers.push(st);
      });
    })();

    return () => {
      cancelled = true;
      triggers.forEach((st) => st.kill());
      triggers = [];
    };
  }, [visualsReady, lang, lines]);

  if (!lines.length) return null;

  return (
    <section
      id="manifesto"
      ref={rootRef}
      className="relative isolate bg-bg"
      aria-label={kicker || 'Manifesto'}
    >
      <div className="sticky top-0 z-0 h-[100svh] overflow-hidden">
        <DeferredFloatingField scrollProgressRef={scrollProgressRef} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[14vh] bg-gradient-to-b from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[14vh] bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div
        ref={contentRef}
        className="manifesto-content relative z-10 -mt-[100svh] px-[3vw] pb-28 pt-[9vh] md:pb-36"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {kicker ? (
          <p
            className={`mb-8 font-display text-sm font-semibold text-accent md:mb-10 ${
              isRtl ? 'tracking-normal' : 'uppercase tracking-[0.28em]'
            }`}
          >
            {kicker}
          </p>
        ) : null}

        <p
          className={`manifesto-copy w-full max-w-none font-display font-bold leading-[1.15] text-ink ${
            isRtl ? 'tracking-normal' : 'tracking-tight'
          }`}
        >
          {lines.map((segments, lineIndex) => (
            <span key={`line-${lineIndex}`} className="block">
              {segments.map((seg, segIndex) =>
                seg.accent ? (
                  <span key={`g-${lineIndex}-${segIndex}`} data-glow className="manifesto-glow">
                    {seg.text}
                  </span>
                ) : (
                  <span key={`t-${lineIndex}-${segIndex}`}>{seg.text}</span>
                )
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
