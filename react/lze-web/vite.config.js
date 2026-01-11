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
        icons: [
          {
            src: '/assets/icon/linzeen.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [/^\/file\//],
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 1234,
    strictPort: true,
    proxy: {
     '/api': {
    target: 'http://127.0.0.1',
    changeOrigin: true,
    rewrite: (path) => path, // 不改 path
  },
  '/file': {
    target: 'http://127.0.0.1',
    changeOrigin: true,
    rewrite: (path) => path,
  },
    },
    middlewareMode: false,
    fs: {
      strict: true
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rewriteMap = {
          '/doc': '/doc.html',
          '/pic': '/pic.html',
          '/tra': '/tra.html',
          '/mon': '/mon.html',
          '/not': '/not.html',
          '/bok': '/bok.html'
        };
        if (rewriteMap[req.url]) {
          req.url = rewriteMap[req.url];
        }
        next();
      });
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
