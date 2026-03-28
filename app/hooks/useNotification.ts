import { useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  createAndroidChannel,
  getFCMToken,
  getMemberId,
  getNotificationUrl,
  requestNotificationPermission,
} from '@/utils/notification';
import { useWebView } from '@/contexts/WebViewContext';
import { getDeviceUUID } from '@/utils/device';
import { putFCMToken } from '@/apis/notification';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const useNotification = () => {
  const { sendMessageToWeb } = useWebView();
  const isRegisteringRef = useRef(false);

  const registerFCMToken = useCallback(async () => {
    if (isRegisteringRef.current) {
      console.log('FCM 토큰 등록이 이미 진행 중입니다.');
      return;
    }

    try {
      isRegisteringRef.current = true;

      const memberId = await getMemberId();
      if (!memberId) return;

      const granted = await requestNotificationPermission();
      if (!granted) return;

      const deviceUuid = await getDeviceUUID();
      const token = await getFCMToken();

      if (token && deviceUuid) {
        await putFCMToken({
          memberId,
          deviceUuid,
          token,
        });

        console.log('FCM 토큰이 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      console.error('FCM 토큰 등록에 실패했습니다.', error);
    } finally {
      isRegisteringRef.current = false;
    }
  }, []);

  // 앱 종료 상태에서 알림을 탭한 경우
  const coldStartNotificationOpen = useCallback(async () => {
    try {
      const message = await messaging().getInitialNotification();
      if (!message) return;

      const url = getNotificationUrl(message.data ?? {});
      if (url) {
        setTimeout(() => {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: { url },
          });
        }, 800);
      }
    } catch (error) {
      console.error('앱 종료 상태의 알림 수신에 문제가 발생했습니다.', error);
    }
  }, [sendMessageToWeb]);

  const onNotification = useCallback(() => {
    coldStartNotificationOpen();

    // FCM 토큰 갱신 리스너: 토큰이 변경되면 자동으로 서버에 업데이트
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async () => {
      console.log('FCM 토큰이 갱신되었습니다');
      try {
        await registerFCMToken();
      } catch (error) {
        console.error('FCM 토큰 갱신 중 오류 발생:', error);
      }
    });

    // FCM 포그라운드 메시지 리스너: 앱이 열려있을 때 FCM 메시지를 받으면 즉시 로컬 알림으로 표시
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        // FCM에서 메시지를 받으면 Expo Notifications로 로컬 알림 표시
        if (remoteMessage.notification) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification.title,
              body: remoteMessage.notification.body,
              data: remoteMessage.data,
            },
            trigger: null, // 즉시 표시 (타이머 없음)
          });
        }
      },
    );

    // 백그라운드에서 알림을 탭한 경우
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        const url = getNotificationUrl(remoteMessage.data ?? {});
        if (url) {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: { url },
          });
        }
      },
    );

    // 포그라운드에서 알림을 탭한 경우
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;

        const url = getNotificationUrl(data);
        if (url) {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: { url },
          });
        }
      });

    // 클린업
    return () => {
      unsubscribeTokenRefresh();
      unsubscribe();
      unsubscribeNotificationOpened();
      responseListener.remove();
    };
  }, [coldStartNotificationOpen, registerFCMToken, sendMessageToWeb]);

  useEffect(() => {
    createAndroidChannel();
  }, []);

  return {
    onNotification,
    registerFCMToken,
  };
};

export default useNotification;
