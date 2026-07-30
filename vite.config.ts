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
          // Split off the map libraries (mapbox-gl alone is hundreds of KB) so they only
          // load when Contact/StoreLocator are actually visited, not on every page.
          if (
            id.includes('mapbox-gl') ||
            id.includes('react-map-gl') ||
            id.includes('@react-google-maps')
          ) {
            return 'maps';
          }
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
  },
});
