import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('react-router-dom')) return 'router';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
