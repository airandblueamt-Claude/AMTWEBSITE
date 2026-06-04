import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Dev only: proxy the AI assistant API to the backend (backend/index.js on :8787).
  // In production, point VITE_CHAT_API at your backend or proxy /api via nginx.
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  // Split heavy libraries into separate, long-cacheable chunks (smaller main bundle).
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-sanity': ['@sanity/client', '@sanity/image-url'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-icons': ['lucide-react', 'react-icons'],
        },
      },
    },
  },
});
