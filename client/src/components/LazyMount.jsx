import { Suspense, lazy, useEffect, useRef, useState } from 'react';

/**
 * Defer mounting a heavy lazy component until near the viewport
 * (or when navbar / hash asks for this section).
 */
export default function LazyMount({
  loader,
  id,
  rootMargin = '320px 0px',
  fallback = null,
  minHeight,
  className,
}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const Lazy = useState(() => lazy(loader))[0];

  useEffect(() => {
    const el = ref.current;
    if (!el || active) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, rootMargin]);

  // Navbar / hash navigation — mount before the section is near the viewport.
  useEffect(() => {
    if (!id || active) return undefined;

    const activateIfMatch = (targetId) => {
      if (targetId === id) setActive(true);
    };

    const onGoto = (event) => activateIfMatch(event.detail?.id);
    const onHash = () => activateIfMatch(window.location.hash.replace(/^#/, ''));

    if (window.location.hash.replace(/^#/, '') === id) setActive(true);

    window.addEventListener('bcode:goto-section', onGoto);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('bcode:goto-section', onGoto);
      window.removeEventListener('hashchange', onHash);
    };
  }, [id, active]);

  return (
    <div
      ref={ref}
      id={active ? undefined : id}
      data-section={id}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {active ? (
        <Suspense fallback={fallback}>
          <Lazy />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
