import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Check, X } from 'lucide-react';
import { BrowserFrame } from './DeviceMockups';

/* Sections shown only on Odoo app pages (projects with an `odoo` block). */

const EDITIONS = ['enterprise', 'community'];

export function CompatibilityStrip({ odoo, labels, labelCase }) {
  const editions = odoo.editions || [];
  const versions = odoo.versions || [];
  if (!editions.length && !versions.length) return null;

  return (
    <section className="border-b border-line/10">
      <div className="container-site grid gap-8 py-8 md:grid-cols-2 md:gap-12 lg:py-10">
        {editions.length ? (
          <div data-project>
            <h2 className={`text-[11px] font-semibold text-muted ${labelCase}`}>{labels.compatibleWith}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[...new Set([...EDITIONS, ...editions])].map((id) => {
                const on = editions.includes(id);
                return (
                  <li
                    key={id}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                      on ? 'border-accent/40 bg-accent/10 text-ink' : 'border-line/10 text-muted line-through'
                    }`}
                  >
                    {on ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4" />}
                    {labels.editions[id] || id}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        {versions.length ? (
          <div data-project>
            <h2 className={`text-[11px] font-semibold text-muted ${labelCase}`}>{labels.odooVersions}</h2>
            <ul className="mt-3 flex flex-wrap gap-2 rtl:justify-end" dir="ltr">
              {versions.map((v) => (
                <li
                  key={v}
                  className="rounded-lg border border-line/15 bg-elevated px-3.5 py-2 font-mono text-sm font-semibold text-ink"
                >
                  {v}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** One row per feature: text beside its screenshot, alternating sides. */
export function FeatureRows({ features, pick, labels, labelCase, onOpen }) {
  if (!features?.length) return null;
  return (
    <section className="border-t border-line/10 py-16 md:py-24">
      <div className="container-site">
        <div data-project className="mx-auto max-w-2xl text-center">
          <p className={`font-display text-xs font-semibold text-accent ${labelCase}`}>{labels.featuresKicker}</p>
          <h2 className="title mt-3">{labels.featuresTitle}</h2>
          <p className="lead mx-auto">{labels.featuresLead}</p>
        </div>
        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {features.map((f, i) => {
            const title = pick(f.title);
            const points = (f.points && pick(f.points)) || [];
            return (
              <div
                key={`${title}-${i}`}
                data-project
                className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14"
              >
                <div className={i % 2 ? 'lg:order-2' : ''}>
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">{title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{pick(f.body)}</p>
                  {points.length ? (
                    <ul className="mt-5 space-y-2">
                      {points.map((pt) => (
                        <li key={pt} className="flex gap-3 text-sm text-ink md:text-base">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                {f.img ? (
                  <button
                    type="button"
                    onClick={() => onOpen({ src: f.img, alt: title })}
                    className="block w-full cursor-zoom-in text-start"
                  >
                    <BrowserFrame src={f.img} alt={title} className="w-full" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Captioned grid of every screen in the app. */
export function ScreenGrid({ screens, pick, labels, labelCase, onOpen }) {
  if (!screens?.length) return null;
  return (
    <section className="border-t border-line/10 bg-elevated/30 py-16 md:py-24">
      <div className="container-site">
        <div data-project className="mx-auto max-w-2xl text-center">
          <p className={`font-display text-xs font-semibold text-accent ${labelCase}`}>{labels.screensKicker}</p>
          <h2 className="title mt-3">{labels.screensTitle}</h2>
          <p className="lead mx-auto">{labels.screensLead}</p>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-10 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {screens.map((shot) => {
            const caption = pick(shot.title);
            return (
              <li key={shot.src} data-project>
                <button
                  type="button"
                  onClick={() => onOpen({ src: shot.src, alt: caption })}
                  className="block w-full cursor-zoom-in text-start"
                >
                  <BrowserFrame src={shot.src} alt={caption} className="w-full transition hover:-translate-y-1" />
                </button>
                <p className="mt-3 font-display text-base font-semibold text-ink">{caption}</p>
                {shot.body ? <p className="mt-1 text-sm leading-relaxed text-muted">{pick(shot.body)}</p> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Lightbox({ image, onClose, closeLabel }) {
  useEffect(() => {
    if (!image) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [image, onClose]);

  if (!image) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <figure className="max-h-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
        <img src={image.src} alt={image.alt} className="max-h-[82svh] w-auto rounded-lg shadow-2xl" />
        <figcaption className="mt-3 text-center text-sm font-semibold text-white/85">{image.alt}</figcaption>
      </figure>
    </div>
  );
}

/** Lightbox state shared by the feature rows and the screen grid. */
export function useLightbox() {
  const [image, setImage] = useState(null);
  const close = useCallback(() => setImage(null), []);
  return { image, open: setImage, close };
}

const bi = PropTypes.shape({ en: PropTypes.string, ar: PropTypes.string });
CompatibilityStrip.propTypes = { odoo: PropTypes.object.isRequired, labels: PropTypes.object.isRequired, labelCase: PropTypes.string };
FeatureRows.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({ title: bi, body: bi, img: PropTypes.string })),
  pick: PropTypes.func.isRequired,
  labels: PropTypes.object.isRequired,
  labelCase: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};
ScreenGrid.propTypes = {
  screens: PropTypes.arrayOf(PropTypes.shape({ src: PropTypes.string, title: bi, body: bi })),
  pick: PropTypes.func.isRequired,
  labels: PropTypes.object.isRequired,
  labelCase: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
};
Lightbox.propTypes = {
  image: PropTypes.shape({ src: PropTypes.string, alt: PropTypes.string }),
  onClose: PropTypes.func.isRequired,
  closeLabel: PropTypes.string,
};
