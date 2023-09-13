import { UserConfigExport, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    testMatch: ['./**/*.test.tsx'],
    globals: true
  },
  build: {
    outDir: '../server/public'
  }
})
