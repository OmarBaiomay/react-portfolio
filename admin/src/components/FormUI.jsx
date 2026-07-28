import { X } from 'lucide-react';

export function Field({
  label,
  hint,
  htmlFor,
  required,
  className = '',
  children,
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      {label ? (
        <label htmlFor={htmlFor} className="form-label">
          {label}
          {required ? <span className="text-accent"> *</span> : null}
        </label>
      ) : null}
      {children}
      {hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}

export function FormSection({ title, description, children, className = '' }) {
  return (
    <section className={`form-section ${className}`}>
      {(title || description) && (
        <header className="mb-4">
          {title ? <h3 className="form-section-title">{title}</h3> : null}
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

export function FormCard({ title, description, children, className = '', actions }) {
  return (
    <div className={`form-card ${className}`}>
      {(title || description || actions) && (
        <div className="form-card-header">
          <div className="min-w-0">
            {title ? <h2 className="font-display text-lg font-bold text-ink">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className="form-card-body">{children}</div>
    </div>
  );
}

export function FormModal({ title, description, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button
        type="button"
        className="fixed inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={`relative z-10 my-0 flex max-h-[100dvh] w-full flex-col rounded-t-2xl border border-line/10 bg-elevated shadow-2xl sm:my-8 sm:max-h-[min(92vh,900px)] sm:rounded-2xl ${
          wide ? 'max-w-3xl' : 'max-w-2xl'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line/10 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function LocaleTabs({ value, onChange, labels }) {
  return (
    <div className="locale-tabs">
      {['en', 'ar'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`locale-tab ${value === code ? 'locale-tab-active' : ''}`}
        >
          {code === 'en' ? labels.en : labels.ar}
        </button>
      ))}
    </div>
  );
}

export function FormActions({ children, className = '' }) {
  return (
    <div className={`form-actions ${className}`}>{children}</div>
  );
}

export function FormGrid({ cols = 2, children, className = '' }) {
  const map = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  return <div className={`grid gap-4 ${map[cols] || map[2]} ${className}`}>{children}</div>;
}
