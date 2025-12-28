import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import svgr from '@svgr/webpack';


// https://vitejs.dev/config/
export default defineConfig({
  base: '/macos',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },

})
