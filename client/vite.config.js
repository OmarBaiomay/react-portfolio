import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Default site content lives in ../shared (also read by the API).
    fs: { allow: ['..'] },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // Leaf-heavy deps only. Forcing react-linked packages into custom chunks
          // created circular imports and a TDZ crash in InputSmart (phone input).
          if (/node_modules\/gsap([/]|$)/.test(id)) return 'gsap';
          return undefined;
        },
      },
    },
  },
});
