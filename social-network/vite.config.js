import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Proxy socket.io requests
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
      // Proxy API requests if used by Meet.happytalk
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy static assets for Meet.happytalk
      '/js': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/css': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sounds': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/svg': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Other necessary routes based on Mirotalk structure
      '/views': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/join': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/newcall': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/activeRooms': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/stats': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/about': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/privacy': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/icetest': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/isRoomActive': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    }
  },
})
