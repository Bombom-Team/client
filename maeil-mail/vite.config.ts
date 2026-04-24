import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'public'),
      '@bombom/shared/env': path.resolve(__dirname, 'src/env.ts'),
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      semicolons: true,
    }),
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
});
