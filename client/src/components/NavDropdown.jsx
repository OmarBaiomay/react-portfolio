import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Compact hover dropdown (desktop) / expandable row (mobile drawer).
 */
export default function NavDropdown({ label, items, onNavigate, mobile = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (mobile) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, [mobile]);

  const renderItems = (itemClassName) =>
    items.map((item) => {
      const key = `${item.href || item.to}-${item.label}`;
      const content = (
        <>
          <span className="block font-medium text-ink">{item.label}</span>
          {item.hint ? (
            <span className="mt-0.5 block text-[11px] leading-snug text-muted">{item.hint}</span>
          ) : null}
        </>
      );

      if (item.to) {
        return (
          <li key={key}>
            <Link
              to={item.to}
              className={itemClassName}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {content}
            </Link>
          </li>
        );
      }

      return (
        <li key={key}>
          <a
            href={item.href}
            className={itemClassName}
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            {content}
          </a>
        </li>
      );
    });

  if (mobile) {
    return (
      <div className="border-b border-line/10 last:border-0">
        <button
          type="button"
          className="nav-link flex w-full justify-between px-3 py-2.5"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {label}
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180 text-accent' : ''}`} />
        </button>
        {open ? (
          <ul className="space-y-0.5 pb-2 ps-2">
            {renderItems(
              'block rounded-md px-3 py-2 text-sm transition hover:bg-line/5'
            )}
          </ul>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="nav-link"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180 text-accent' : ''}`} />
      </button>

      <div
        className={`nav-drop-panel ${open ? '!block' : ''}`}
        role="menu"
      >
        <ul className="space-y-0.5">
          {renderItems('block rounded-lg px-3 py-2 text-sm transition hover:bg-line/5')}
        </ul>
      </div>
    </div>
  );
}

NavDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      to: PropTypes.string,
      hint: PropTypes.string,
    })
  ).isRequired,
  onNavigate: PropTypes.func,
  mobile: PropTypes.bool,
};
