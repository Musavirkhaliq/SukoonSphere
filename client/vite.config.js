import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'path';



export default defineConfig({

  plugins: [react()],

  server: {

    proxy: {

      '/api': {

        target: 'http://localhost:5100/api',

        changeOrigin: true,

        rewrite: (path) => path.replace(/^\/api/, ''),

      },
    },
  },

  resolve: {

    alias: {

      '@': path.resolve(__dirname, './src'),

    },

  },

});