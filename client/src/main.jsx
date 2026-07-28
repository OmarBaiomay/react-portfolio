import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { bootstrapAppearance } from './lib/bootstrapAppearance';
import './index.css';

// Warm theme / hero / manifesto caches before (and while) React mounts.
bootstrapAppearance().catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
