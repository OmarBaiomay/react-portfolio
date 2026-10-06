import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* CSS device frames for real screenshots. Sizes are driven by the parent width. */

const shotProps = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export function BrowserFrame({ src, alt, host, className = '' }) {
  return (
    <div
      className={`device-shot overflow-hidden rounded-xl border border-line/10 bg-elevated shadow-card ${className}`}
      dir="ltr"
    >
      <div className="flex items-center gap-1.5 border-b border-line/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        {host ? (
          <span className="ml-2 hidden truncate rounded bg-line/5 px-2 py-0.5 font-mono text-[10px] text-muted sm:block">
            {host}
          </span>
        ) : null}
      </div>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        draggable="false"
        width="1440"
        height="900"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}
BrowserFrame.propTypes = { ...shotProps, host: PropTypes.string };

/*
 * Tablet/phone: the outer div takes the caller's size + position classes; the inner
 * div is the bezel. Percentage padding resolves against the *containing block's*
 * width, so it must live on the inner div to scale with the device, not the page.
 */
export function TabletFrame({ src, alt, className = '' }) {
  return (
    <div className={`device-shot ${className}`}>
      <div className="rounded-[7%/5%] bg-neutral-900 p-[3.5%] shadow-card ring-1 ring-white/10">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable="false"
          width="820"
          height="1180"
          className="block aspect-[820/1180] w-full rounded-[4%/3%] object-cover object-top"
        />
      </div>
    </div>
  );
}
TabletFrame.propTypes = shotProps;

export function PhoneFrame({ src, alt, className = '' }) {
  return (
    <div className={`device-shot ${className}`}>
      <div className="relative rounded-[14%/6.5%] bg-neutral-900 p-[4%] shadow-card ring-1 ring-white/10">
        <span className="absolute left-1/2 top-[2.6%] z-10 h-[2.2%] w-[28%] -translate-x-1/2 rounded-full bg-neutral-900" />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable="false"
          width="780"
          height="1688"
          className="block aspect-[390/844] w-full rounded-[10%/4.6%] object-cover object-top"
        />
      </div>
    </div>
  );
}
PhoneFrame.propTypes = shotProps;

/** Overlapping desktop + tablet + phone composition. */
export function DeviceStack({ desktop, tablet, phone, host }) {
  return (
    <div className="relative pb-[6%]" dir="ltr">
      <div className="pointer-events-none absolute inset-x-[10%] top-[10%] bottom-0 rounded-full bg-accent/15 blur-3xl" />
      {desktop ? (
        <BrowserFrame {...desktop} host={host} className="relative mx-auto w-[78%]" />
      ) : null}
      {tablet ? (
        <TabletFrame {...tablet} className="absolute bottom-0 left-0 w-[24%]" />
      ) : null}
      {phone ? <PhoneFrame {...phone} className="absolute bottom-0 right-[1%] w-[15%]" /> : null}
    </div>
  );
}

const shotShape = PropTypes.shape({ src: PropTypes.string, alt: PropTypes.string });
DeviceStack.propTypes = {
  desktop: shotShape,
  tablet: shotShape,
  phone: shotShape,
  host: PropTypes.string,
};

/**
 * Phones in a swipe row on small screens (grid from md up), with scroll cues:
 * an edge fade, prev/next arrows, and dots that follow the centred phone.
 * Direction-agnostic: works in RTL because it measures positions, not scrollLeft.
 */
export function PhoneCarousel({ shots, labels }) {
  const rowRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = row.getBoundingClientRect();
        const centre = box.left + box.width / 2;
        let best = 0;
        let bestDist = Infinity;
        [...row.children].forEach((child, i) => {
          const r = child.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - centre);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setActive(best);
      });
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener('scroll', onScroll);
    };
  }, []);

  const goTo = (index) => {
    const child = rowRef.current?.children[index];
    child?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const atStart = active === 0;
  const atEnd = active === shots.length - 1;

  return (
    <div className="relative">
      <div
        ref={rowRef}
        className="scroll-hide -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[19%] pb-4 sm:px-[30%] md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 lg:px-16"
      >
        {shots.map((shot, i) => (
          <PhoneFrame
            key={shot.src}
            {...shot}
            className={`w-[62%] shrink-0 snap-center transition-opacity duration-300 sm:w-[40%] md:w-auto md:opacity-100 ${
              i === active ? 'opacity-100' : 'opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Scroll cues — small screens only */}
      <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={atStart}
          aria-label={labels.prev}
          className="icon-btn h-9 w-9 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          {shots.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1} / ${shots.length}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-accent' : 'w-2 bg-line/25'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={atEnd}
          aria-label={labels.next}
          className="icon-btn h-9 w-9 disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-muted md:hidden">{labels.swipe}</p>
    </div>
  );
}

PhoneCarousel.propTypes = {
  shots: PropTypes.arrayOf(shotShape).isRequired,
  labels: PropTypes.shape({
    prev: PropTypes.string,
    next: PropTypes.string,
    swipe: PropTypes.string,
  }).isRequired,
};
