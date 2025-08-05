import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup/setup.ts'],
    globals: true,
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
