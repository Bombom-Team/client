import fs from 'fs';
import path from 'path';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';

const ENV_KEYS = [
  'API_BASE_URL',
  'API_BASE_URL_EVENT',
  'API_BASE_URL_NOTIFICATION',
  'API_TOKEN',
  'ENABLE_MSW',
  'SENTRY_DSN',
  'NODE_ENV',
  'CLARITY_PROJECT_ID',
  'MONITORING_STATUS_URL',
  'CHANNEL_TALK_PLUGIN_KEY',
  'CAPTCHA_SITE_KEY',
  'SERVER_TYPE',
] as const;

function postBuildAssetsPlugin(env: Record<string, string>, isProd: boolean): Plugin {
  return {
    name: 'bombom-post-build-assets',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(dist)) return;

      const serverType = env.SERVER_TYPE;
      if (serverType) {
        const target = path.join(dist, `robots.${serverType}.txt`);
        if (fs.existsSync(target)) {
          fs.renameSync(target, path.join(dist, 'robots.txt'));
        }
      }

      for (const file of fs.readdirSync(dist)) {
        if (/^robots\..+\.txt$/.test(file)) {
          fs.unlinkSync(path.join(dist, file));
        }
      }

      if (!isProd) {
        const sitemap = path.join(dist, 'sitemap.xml');
        if (fs.existsSync(sitemap)) fs.unlinkSync(sitemap);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') } as Record<
    string,
    string
  >;
  const isProd = mode === 'production';

  const define = Object.fromEntries(
    ENV_KEYS.map((key) => [`process.env.${key}`, JSON.stringify(env[key] ?? '')]),
  );

  return {
    define,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '#': path.resolve(__dirname, 'public'),
        '@bombom/shared/env': path.resolve(__dirname, 'src/apis/env.ts'),
      },
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        semicolons: true,
      }),
      svgr({ include: '**/*.svg' }),
      react(),
      postBuildAssetsPlugin(env, isProd),
    ],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    esbuild: isProd
      ? {
          drop: ['debugger'],
          pure: ['console.log', 'console.info', 'console.warn'],
        }
      : {},
  };
});
