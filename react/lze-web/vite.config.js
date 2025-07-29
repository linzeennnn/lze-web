import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'lze-web',
        short_name: 'lze-web',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        // 不设置 theme_color，让 HTML 控制
        icons: [
          {
            src: '/assets/icon/linzeen.svg', // WebApp + 安卓
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/assets/icon/linzeen_apple.png', // iPhone
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 1234,
    strictPort: true,
    proxy: {
      '/server': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, '/server'),
      },
      '/file': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/file/, '/file'),
      },
    }
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        doc: resolve(__dirname, 'doc.html'),
        pic: resolve(__dirname, 'pic.html'),
        tra: resolve(__dirname, 'tra.html'),
        mon: resolve(__dirname, 'mon.html'),
        not: resolve(__dirname, 'not.html'),
        bok: resolve(__dirname, 'bok.html'),
      },
    },
  }
});
