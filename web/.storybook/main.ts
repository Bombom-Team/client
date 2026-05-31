import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      define: {
        'process.env.API_BASE_URL': JSON.stringify(
          process.env.API_BASE_URL ?? 'https://api-dev.bombom.news/api/v1',
        ),
        'process.env.API_TOKEN': JSON.stringify(process.env.API_TOKEN ?? ''),
        'process.env.ENABLE_MSW': JSON.stringify(process.env.ENABLE_MSW ?? 'false'),
      },
    });
  },
};

export default config;
