// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Make sure Vite falls back to index.html for client-side routing
    historyApiFallback: true
  }
});
