import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'app/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        '__tests__/',
        'tests/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.ts',
        'app/layout.tsx',
        'middleware.ts'
      ],
      thresholds: {
        lines: 60,
        functions: 50,
        branches: 50,
        statements: 60
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
})
