const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const defaultResolver = defaultConfig.resolver.resolveRequest;

const customResolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@bombom/shared/env') {
    return {
      filePath: path.resolve(__dirname, 'constants/env.ts'),
      type: 'sourceFile',
    };
  }

  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

/** @type {import('metro-config').ConfigT} */
const config = {
  ...defaultConfig,
  resolver: {
    ...defaultConfig.resolver,
    resolveRequest: customResolveRequest,
  },
};

module.exports = config;
