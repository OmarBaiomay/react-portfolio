/**
 * Hero visual — pure CSS/SVG (no Three.js). A code editor window that
 * "builds" a project line by line, plus a small live-status chip.
 * Always LTR: it shows code, regardless of the page language.
 */
const CODE = [
  [{ c: 'text-muted/70', t: '// b-code.tech' }],
  [
    { c: 'text-accent', t: 'const ' },
    { c: 'text-ink', t: 'project ' },
    { c: 'text-muted', t: '= ' },
    { c: 'text-accent', t: 'await ' },
    { c: 'text-ink', t: 'bcode.build' },
    { c: 'text-muted', t: '({' },
  ],
  [
    { c: 'text-ink', t: '  web' },
    { c: 'text-muted', t: ':      ' },
    { c: 'text-emerald-400', t: "'fast & converting'" },
    { c: 'text-muted', t: ',' },
  ],
  [
    { c: 'text-ink', t: '  odoo' },
    { c: 'text-muted', t: ':     ' },
    { c: 'text-emerald-400', t: "'runs operations'" },
    { c: 'text-muted', t: ',' },
  ],
  [
    { c: 'text-ink', t: '  software' },
    { c: 'text-muted', t: ': ' },
    { c: 'text-emerald-400', t: "'fits your process'" },
    { c: 'text-muted', t: ',' },
  ],
  [{ c: 'text-muted', t: '});' }],
  [],
  [
    { c: 'text-ink', t: 'project' },
    { c: 'text-muted', t: '.' },
    { c: 'text-ink', t: 'ship' },
    { c: 'text-muted', t: '();' },
  ],
];

export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]" dir="ltr" aria-hidden="true">
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-accent/20 blur-3xl" />

      <div className="hero-code relative overflow-hidden rounded-2xl border border-line/10 bg-elevated/80 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-line/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted">project.js</span>
        </div>

        <pre className="overflow-hidden px-5 py-5 font-mono text-[13px] leading-7 sm:text-sm">
          {CODE.map((tokens, i) => (
            <div key={i} className="hero-code-line flex" style={{ '--i': i }}>
              <span className="mr-5 w-4 select-none text-right text-muted/40">{i + 1}</span>
              <span className="whitespace-pre">
                {tokens.map((tok, j) => (
                  <span key={j} className={tok.c}>
                    {tok.t}
                  </span>
                ))}
                {i === CODE.length - 1 ? <span className="hero-caret" /> : null}
              </span>
            </div>
          ))}
        </pre>
      </div>

      <div className="hero-chip absolute -bottom-5 right-6 flex items-center gap-2.5 rounded-full border border-line/10 bg-elevated px-4 py-2 shadow-card">
        <span className="relative flex h-2.5 w-2.5">
          <span className="contact-pulse absolute inset-0 rounded-full bg-emerald-400" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono text-xs font-medium text-ink">Deployed · live</span>
      </div>
    </div>
  );
}
