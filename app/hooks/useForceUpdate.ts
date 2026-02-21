import { APP_STORE_LINK, PLAY_STORE_LINK } from '@bombom/shared';
import remoteConfig from '@react-native-firebase/remote-config';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { version } from '../package.json';

const parseVersion = (input: string) => {
  return input
    .split('.')
    .map((part) => Number(part.replace(/[^0-9]/g, '')) || 0);
};

const compareVersion = (currentVersion: string, minVersion: string) => {
  const current = parseVersion(currentVersion);
  const minimum = parseVersion(minVersion);
  const length = Math.max(current.length, minimum.length);

  for (let index = 0; index < length; index += 1) {
    const currentPart = current[index] ?? 0;
    const minimumPart = minimum[index] ?? 0;

    if (currentPart > minimumPart) {
      return 1;
    }

    if (currentPart < minimumPart) {
      return -1;
    }
  }

  return 0;
};

const checkForceUpdateRequired = async () => {
  try {
    await remoteConfig().setDefaults({
      android_min_version: '0.0.0',
      ios_min_version: '0.0.0',
    });

    await remoteConfig().fetchAndActivate();

    const androidMinVersion = remoteConfig()
      .getValue('android_min_version')
      .asString();
    const iosMinVersion = remoteConfig().getValue('ios_min_version').asString();
    const minVersion = Platform.OS === 'android' ? androidMinVersion : iosMinVersion;

    return compareVersion(version, minVersion) < 0;
  } catch (error) {
    console.error('강제 업데이트 체크 실패:', error);
    return false;
  }
};

export const useForceUpdate = () => {
  const [isVersionCheckCompleted, setIsVersionCheckCompleted] = useState(false);
  const [isForceUpdateRequired, setIsForceUpdateRequired] = useState(false);

  const openStore = async () => {
    const url = Platform.OS === 'ios' ? APP_STORE_LINK : PLAY_STORE_LINK;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('스토어 열기 실패:', error);
      Alert.alert('오류', '스토어를 열 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeVersionCheck = async () => {
      const required = await checkForceUpdateRequired();

      if (!isMounted) {
        return;
      }

      setIsForceUpdateRequired(required);
      setIsVersionCheckCompleted(true);

      if (required) {
        SplashScreen.hide();
      }
    };

    initializeVersionCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isVersionCheckCompleted,
    isForceUpdateRequired,
    openStore,
  };
};
