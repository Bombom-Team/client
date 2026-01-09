import { ConfigContext, ExpoConfig } from 'expo/config';
import { version } from './package.json';

const APP_CONFIG = {
  name: '봄봄',
  slug: 'bombom',
  color: '#FE5E04',
  bundleIdentifier: 'com.antarctica.bombom',
  icon: './app/assets/images/logo.png',
};

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: APP_CONFIG.name,
    slug: APP_CONFIG.slug,
    version,
    runtimeVersion: {
      policy: 'appVersion',
    },
    orientation: 'portrait',
    icon: APP_CONFIG.icon,
    scheme: 'bombom',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      googleServicesFile: './GoogleService-Info.plist',
      infoPlist: {
        UIBackgroundModes: ['remote-notification'],
        NSExceptionDomains: {
          'bombom.news': {
            NSIncludesSubdomains: true,
            NSTemporaryExceptionAllowsInsecureHTTPLoads: true,
            NSTemporaryExceptionMinimumTLSVersion: 'TLSv1.2',
          },
        },
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
      },
      bundleIdentifier: APP_CONFIG.bundleIdentifier,
      config: {
        usesNonExemptEncryption: false, // 수출 규정 관련 문서 누락됨 메시지 해결
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './app/assets/images/logo-android.png',
        backgroundColor: APP_CONFIG.color,
      },
      edgeToEdgeEnabled: true,
      package: APP_CONFIG.bundleIdentifier,
      googleServicesFile: './google-services.json',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: APP_CONFIG.icon,
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: APP_CONFIG.icon,
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: APP_CONFIG.color,
        },
      ],
      [
        '@react-native-google-signin/google-signin',
        {
          iosUrlScheme:
            'com.googleusercontent.apps.190361254930-1464b7md34crhu077urc0hsvtsmb5ks5',
        },
      ],
      [
        'expo-apple-authentication',
        {
          appleTeamId: 'F6XK836QA8',
        },
      ],
      'expo-secure-store',
      'expo-web-browser',
      [
        'expo-web-browser',
        {
          experimentalLauncherActivity: true,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
          ios: {
            useFrameworks: 'static',
            buildReactNativeFromSource: true,
          },
        },
      ],
      [
        'expo-notifications',
        {
          icon: './app/assets/images/logo-android.png',
          color: APP_CONFIG.color,
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
      './plugins/withAndroidManifestFix',
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: 'd2ce3cbd-5c00-4471-8f7f-b4309d071e84',
      },
    },
    owner: 'antarctica-bombom',
  };
};
