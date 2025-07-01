import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // 监听所有地址，包括 127.0.0.1、localhost 和内网 IP
    port: 8080,           // 可选：指定端口（默认就是 5173）
    strictPort: true, 
    proxy: {
      '/server': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, '/server'),
      }
    }    // 可选：端口被占用时是否报错（true）还是自动换端口（false）
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
