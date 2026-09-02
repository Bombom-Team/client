import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic', jsxImportSource: '@emotion/react' },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@bombom/shared/env': fileURLToPath(
        new URL('./src/apis/env.ts', import.meta.url),
      ),
    },
  },
  test: { environment: 'jsdom', include: ['tests/**/*.test.tsx'] },
});
