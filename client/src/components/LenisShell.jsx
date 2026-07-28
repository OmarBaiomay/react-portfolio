import { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

function LenisBridge() {
  const lenis = useLenis();
  useEffect(() => {
    window.__bcodeLenis = lenis || null;
    return () => {
      window.__bcodeLenis = null;
    };
  }, [lenis]);
  return null;
}

export default function LenisShell({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
