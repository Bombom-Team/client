const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const path = require('path');

const defaultConfig = getSentryExpoConfig(__dirname, {
  includeWebFeedback: false,
  includeWebReplay: false,
});

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
