import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'YatraMitra AI',
        short_name: 'YatraMitra',
        description: 'AI-powered travel planning for Indian tourism — destinations, itineraries, local guides and more.',
        theme_color: '#1b2a4a',
        background_color: '#0a0f1c',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell (JS/CSS/HTML) is precached, so the app itself loads offline
        // once visited. Data and photos are cached at runtime as the visitor
        // browses, so previously-seen destinations, hotels and plans stay
        // available without a connection — this is real, limited offline
        // support (what you've already loaded), not a full offline database.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'yatramitra-api-cache',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 3 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'commons.wikimedia.org',
            handler: 'CacheFirst',
            options: {
              cacheName: 'yatramitra-photo-cache',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Every route is already lazy-loaded (see App.jsx) — this further
        // splits the shared chunk every route depends on, so a deploy that
        // only touches app code doesn't invalidate the React/animation
        // vendor cache in returning visitors' browsers.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('/react/') || id.includes('/react-dom/')) return 'react-vendor';
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
          }
        },
      },
    },
  },
})
