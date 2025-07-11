import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    watch: false,
    exclude: [
      'node_modules',
      'playwright.config.*',
      'tests/**', // Playwright tests are placed here
      '**/*.spec.@(ts|tsx)',
    ],
  },
})
