import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/7015P/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
