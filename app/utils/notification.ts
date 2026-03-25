import messaging, {
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEY } from '@/constants/asyncStorage';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import { applicationId } from 'expo-application';

// 안드로이드 알림 채널 생성
export const createAndroidChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
};

// 사용자 알림 권한 요청
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const auth = await requestPermission(getMessaging());

      return (
        auth === AuthorizationStatus.AUTHORIZED ||
        auth === AuthorizationStatus.PROVISIONAL
      );
    }

    if (Platform.OS === 'android') {
      const { status } = await Notifications.requestPermissionsAsync();

      return status === 'granted';
    }

    return false;
  } catch (error) {
    console.error('권한 요청 실패:', error);
    return false;
  }
};

export const checkNotificationPermission = async () => {
  if (!Device.isDevice) {
    return false;
  }

  if (Platform.OS === 'ios') {
    const iosGrantedStatus = await hasPermission(getMessaging());
    return (
      iosGrantedStatus === AuthorizationStatus.AUTHORIZED ||
      iosGrantedStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  if (Platform.OS === 'android') {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  }

  return false;
};

export const goToSystemPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      await Linking.openSettings();
    }

    if (Platform.OS === 'android') {
      await startActivityAsync(ActivityAction.APP_NOTIFICATION_SETTINGS, {
        extra: {
          'android.provider.extra.APP_PACKAGE': applicationId,
          app_package: applicationId,
        },
      });
    }
  } catch (error) {
    console.error('알림 권한 설정을 여는데 실패했습니다. :', error);
  }
};

export const getFCMToken = async () => {
  try {
    const isPermissionGranted = await checkNotificationPermission();
    if (!isPermissionGranted) {
      throw new Error('푸시 알림 권한이 없습니다.');
    }

    const token = await getToken(getMessaging());
    return token;
  } catch (error) {
    console.error('FCM 토큰을 가져오는데 실패했습니다.', error);
  }
};

export const updateMemberId = async (id: number) => {
  try {
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY.memberId, String(id));
  } catch (error) {
    console.error('memberId 저장에 실패했습니다.', error);
  }
};

export const getMemberId = async () => {
  try {
    const memberIdString = await AsyncStorage.getItem(
      ASYNC_STORAGE_KEY.memberId,
    );
    return Number(memberIdString);
  } catch (error) {
    console.error('memberId 조회에 실패했습니다.', error);
  }
};

export const getNotificationUrl = (data: Record<string, unknown>) => {
  switch (data.notificationType) {
    case 'ARTICLE':
      return `/articles/${data.articleId}`;
    case 'EVENT':
      return '/event';
    default:
      return null;
  }
};
