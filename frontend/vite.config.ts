import { defineConfig } from 'vitest/config' 
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    globals: true,
    setupFiles: "./src/tests/setup.ts",
    environment: 'jsdom'
  },
})
