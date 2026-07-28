import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PhoneInput, { getCountries, getCountryCallingCode, isValidPhoneNumber } from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import enLabels from 'react-phone-number-input/locale/en';
import arLabels from 'react-phone-number-input/locale/ar';
import { ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import 'react-phone-number-input/style.css';

export { isValidPhoneNumber };

const PRIORITY = ['EG', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'PS', 'SY', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'SD', 'YE', 'US', 'GB', 'DE', 'FR', 'TR'];

function getLenis() {
  return typeof window !== 'undefined' ? window.__bcodeLenis || null : null;
}

function FlagIcon({ country, label }) {
  const Flag = flags[country];
  if (!Flag) {
    return (
      <span className="inline-block h-3.5 w-5 rounded-[2px] bg-line/20" aria-hidden="true" />
    );
  }
  return (
    <span className="PhoneInputCountryIcon--bcode inline-flex h-3.5 w-5 overflow-hidden rounded-[2px]">
      <Flag title={label} />
    </span>
  );
}

function CountrySelect({ value, onChange, options, disabled }) {
  const { lang, t } = useLanguage();
  const labels = lang === 'ar' ? arLabels : enLabels;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [pos, setPos] = useState({ top: 0, left: 0, width: 300 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const countries = useMemo(() => {
    const set = new Set(getCountries());
    const ordered = [
      ...PRIORITY.filter((c) => set.has(c)),
      ...[...set].filter((c) => !PRIORITY.includes(c)).sort((a, b) =>
        (labels[a] || a).localeCompare(labels[b] || b, lang)
      ),
    ];
    return ordered;
  }, [labels, lang]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((code) => {
      const name = (labels[code] || code).toLowerCase();
      const dial = getCountryCallingCode(code);
      return name.includes(q) || code.toLowerCase().includes(q) || dial.includes(q.replace('+', ''));
    });
  }, [countries, labels, query]);

  const updatePos = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    let left = r.left;
    if (left + width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - width - 12);
    setPos({ top: r.bottom + 6, left, width });
  };

  useEffect(() => {
    if (!open) return undefined;
    updatePos();
    const onMove = () => updatePos();
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (btnRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setOpen(false);
      setQuery('');
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Same pattern as nma_pos_loyalty_points phone_code_select.js:
  // Lenis (smoothWheel) steals wheel events — capture + scroll the list ourselves.
  useEffect(() => {
    if (!open) return undefined;

    const lenis = getLenis();
    lenis?.stop?.();

    const onWheel = (ev) => {
      const menu = menuRef.current;
      const list = listRef.current;
      if (!menu || !list) return;
      if (!menu.contains(ev.target)) return;

      const delta = ev.deltaY || (ev.detail ? ev.detail * 16 : 0);
      if (!delta) return;

      list.scrollTop += delta;
      ev.preventDefault();
      ev.stopPropagation();
    };

    document.addEventListener('wheel', onWheel, { capture: true, passive: false });
    document.addEventListener('mousewheel', onWheel, { capture: true, passive: false });
    document.addEventListener('DOMMouseScroll', onWheel, { capture: true, passive: false });

    return () => {
      document.removeEventListener('wheel', onWheel, true);
      document.removeEventListener('mousewheel', onWheel, true);
      document.removeEventListener('DOMMouseScroll', onWheel, true);
      lenis?.start?.();
    };
  }, [open]);

  void options;

  const selectedLabel = value ? labels[value] || value : '';
  const selectedDial = value ? `+${getCountryCallingCode(value)}` : '';

  const menu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-[300] flex max-h-[min(70vh,22rem)] flex-col overflow-hidden rounded-xl border border-line/15 bg-elevated shadow-card"
            dir="ltr"
          >
            <div className="relative shrink-0 border-b border-line/10 p-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.contact.searchCountry}
                className="text-field !py-2 !pl-9 !pr-3 text-sm"
                autoFocus
                dir="auto"
              />
            </div>
            <ul
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
              dir="ltr"
            >
              {filtered.map((code) => {
                const active = code === value;
                const name = labels[code] || code;
                const dial = `+${getCountryCallingCode(code)}`;
                return (
                  <li key={code}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition hover:bg-surface ${
                        active ? 'bg-accent/10 text-accent' : 'text-ink'
                      }`}
                      onClick={() => {
                        onChange(code);
                        setOpen(false);
                        setQuery('');
                      }}
                    >
                      <FlagIcon country={code} label={name} />
                      <span className="w-12 shrink-0 font-semibold tabular-nums">{dial}</span>
                      <span className="min-w-0 flex-1 truncate text-left text-muted">{name}</span>
                    </button>
                  </li>
                );
              })}
              {!filtered.length ? (
                <li className="px-3 py-4 text-left text-sm text-muted">{t.contact.noCountry}</li>
              ) : null}
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="PhoneInputCountryButton flex h-full items-center gap-1.5 pe-2 disabled:opacity-60"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={selectedLabel ? `${selectedLabel} ${selectedDial}` : 'Country'}
      >
        {value ? <FlagIcon country={value} label={selectedLabel} /> : null}
        <ChevronDown className={`h-3.5 w-3.5 text-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {menu}
    </>
  );
}

export default function PhoneField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}) {
  const { lang } = useLanguage();
  const labels = lang === 'ar' ? arLabels : enLabels;

  return (
    <div className="phone-field w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block">
          {label}
        </label>
      ) : null}
      <PhoneInput
        id={id}
        international
        defaultCountry="EG"
        countryCallingCodeEditable={false}
        flags={flags}
        labels={labels}
        value={value}
        onChange={(next) => onChange(next || '')}
        placeholder={placeholder}
        disabled={disabled}
        countrySelectComponent={CountrySelect}
        numberInputProps={{
          required,
          className: 'PhoneInputInput',
        }}
        className="PhoneInput--bcode"
      />
    </div>
  );
}
