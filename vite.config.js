import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Keeps project root as current directory
  base: './', // Ensures Vite generates relative paths for assets

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './assets'), // Alias for the assets directory
    },
  },
  optimizeDeps: {
    include: ['jquery', 'p5', 'aos', 'pace-js'], // Pre-bundle these dependencies
  },
  build: {
    rollupOptions: {
      external: [
        /^https:\/\/maps\.googleapis\.com/, // Externalize Google Maps API
      ],
      output: {
        manualChunks: {
          // Split vendor libraries into a separate chunk
          vendor: ['jquery', 'p5', 'aos', 'pace-js'],
          
          // Split larger application-specific code chunks
          app: ['./assets/js/main.js', './assets/js/boids.js', './assets/js/summit.js'],
        },
      },
    },
    assetsInlineLimit: 8192, // Inline assets below 8KB
    outDir: 'dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    chunkSizeWarningLimit: 1000, // Increase warning limit for chunk size
  },
  server: {
    open: true, // Automatically open the browser
    port: 3000, // Default port
  },
});