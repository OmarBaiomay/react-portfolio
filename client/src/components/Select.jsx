import { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Check, ChevronDown } from 'lucide-react';

/**
 * Styled dropdown that replaces the native <select>: themed trigger, animated option panel,
 * keyboard support (arrows, Home/End, Enter, Escape, Tab) and right-to-left aware positioning.
 */
export default function Select({ id, value, onChange, options, ariaLabel, className = '', size = 'md' }) {
  const autoId = useId();
  const listId = `${id || autoId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    setActive(selectedIndex);
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, selectedIndex]);

  const choose = (index) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e) => {
    const last = options.length - 1;
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, last));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(last);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const height = size === 'lg' ? 'h-12' : 'h-11';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`group flex w-full items-center justify-between gap-3 rounded-xl border bg-elevated/60 px-4 text-start text-sm font-semibold text-ink outline-none transition ${height} ${
          open ? 'border-accent/60 ring-4 ring-accent/15' : 'border-line/15 hover:border-accent/40'
        } focus-visible:border-accent/60 focus-visible:ring-4 focus-visible:ring-accent/15`}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selected?.icon ? <selected.icon className="h-4 w-4 shrink-0 text-accent" /> : null}
          <span className="truncate">{selected?.label}</span>
        </span>
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md transition ${
            open ? 'bg-accent/15 text-accent' : 'text-muted group-hover:text-ink'
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-label={ariaLabel}
        className={`absolute end-0 top-[calc(100%+0.5rem)] z-40 min-w-full origin-top overflow-hidden rounded-xl border border-line/15 bg-elevated p-1.5 shadow-2xl ring-1 ring-black/5 transition duration-200 ease-out ${
          open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-1 scale-95 opacity-0'
        }`}
      >
        {options.map((option, i) => {
          const isSelected = option.value === value;
          return (
            <li
              key={option.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-6 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition-colors ${
                i === active ? 'bg-accent/10 text-ink' : 'text-muted'
              } ${isSelected ? 'font-semibold text-ink' : ''}`}
            >
              <span className="flex items-center gap-2">
                {option.icon ? <option.icon className="h-4 w-4 text-accent" /> : null}
                {option.label}
              </span>
              <Check className={`h-4 w-4 text-accent transition ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.node.isRequired, icon: PropTypes.elementType })
  ).isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['md', 'lg']),
};
