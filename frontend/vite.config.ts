import { defineConfig } from 'vitest/config' 
import { playwright } from '@vitest/browser-playwright'
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
  browser: {
    provider: playwright(),
    enabled: true,
    instances: [
      { browser: 'chromium' },
    ],
  },
  globals: true,
  setupFiles: "./src/_tests/setup.ts",
}
})
