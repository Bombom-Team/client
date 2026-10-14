import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import { EmotionThemeProvider } from '../contexts/ThemeContext';
import { WebViewProvider } from '../contexts/WebViewContext';
import { initSentry } from '../libs/sentry/initSentry';

import * as Sentry from '@sentry/react-native';

initSentry();
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    activateKeepAwakeAsync();

    return () => {
      deactivateKeepAwake();
    };
  }, []);

  return (
    <EmotionThemeProvider>
      <WebViewProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <Slot />
        </AuthProvider>
      </WebViewProvider>
    </EmotionThemeProvider>
  );
}

export default Sentry.wrap(RootLayout);
