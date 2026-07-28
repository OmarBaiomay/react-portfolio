import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['images/favicon.svg', 'images/logo.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: '/',
        name: 'B-Code Admin',
        short_name: 'B-Code',
        description: 'B-Code CRM, projects, and site management',
        theme_color: '#050505',
        background_color: '#050505',
        display: 'standalone',
        orientation: 'any',
        scope: base,
        start_url: base,
        lang: 'ar',
        dir: 'rtl',
        categories: ['business', 'productivity'],
        icons: [
          {
            src: `${base}icons/icon-192.png`.replace(/\/{2,}/g, '/'),
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}icons/icon-512.png`.replace(/\/{2,}/g, '/'),
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${base}icons/icon-512.png`.replace(/\/{2,}/g, '/'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: `${base}index.html`.replace(/\/{2,}/g, '/'),
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'bcode-api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 32, maxAgeSeconds: 60 * 5 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
