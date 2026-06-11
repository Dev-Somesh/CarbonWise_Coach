import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/utils/**/*.ts', 'src/hooks/**/*.ts'],
      exclude: [
        'src/utils/pdfGenerator.ts',
        'src/utils/quickWinTips.ts',
        'src/hooks/useSmartCoach.ts',
        'src/**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/setupTests.ts',
      ],
      thresholds: {
        lines: 75,
        branches: 50,
        functions: 80,
        statements: 75,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
