import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/app-icon.svg'],
      manifest: {
        name: 'Ashfall Patrol',
        short_name: 'Ashfall',
        description: 'A mobile isometric RPG simulation prototype.',
        theme_color: '#161a14',
        background_color: '#161a14',
        display: 'standalone',
        orientation: 'any',
        scope: base,
        start_url: base,
        icons: [
          {
            src: 'icons/app-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/processed-assets\/.*\.(?:glb|json)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ashfall-models-v1',
              expiration: {
                maxEntries: 12,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    chunkSizeWarningLimit: 1400
  }
});
