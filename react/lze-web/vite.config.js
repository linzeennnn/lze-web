import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     
    port: 8080,           
    strictPort: true, 
    proxy: {
      '/server': {
        target: 'http://127.0.0.1:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, '/server'),
      }
    }   
  },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        doc: resolve(__dirname, 'public/doc.html'),
      },
    },
  }
});
