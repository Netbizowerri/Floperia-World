import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Resolves @/ imports to the src/ directory (standard Vite convention)
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own cacheable chunk
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Split React + Router into a stable vendor chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Split animation library
          'vendor-motion': ['motion/react'],
          // Split TanStack Query
          'vendor-query': ['@tanstack/react-query'],
          // Split Zustand state management
          'vendor-zustand': ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify — file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
