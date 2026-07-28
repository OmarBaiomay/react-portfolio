/**
 * Theme-aware logo mark. Uses the SVG as a mask filled with current ink,
 * so it stays visible in light and dark without invert hacks.
 */
export default function BrandLogo({ className = 'h-11 w-11', title }) {
  return (
    <span
      className={`brand-logo-mask inline-block shrink-0 bg-ink ${className}`}
      style={{
        WebkitMaskImage: 'url(/images/logo.svg)',
        maskImage: 'url(/images/logo.svg)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
      role={title ? 'img' : 'presentation'}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    />
  );
}
