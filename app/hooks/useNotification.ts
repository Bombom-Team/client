import { useEffect, useCallback, useState } from 'react';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';
import {
  createAndroidChannel,
  deleteFCMToken,
  getFCMToken,
  requestNotificationPermission,
} from '@/utils/notification';
import { useWebView } from '@/contexts/WebViewContext';
import {
  getDeviceUUID,
  getLastRegisteredMemberId,
  setLastRegisteredMemberId,
} from '@/utils/device';
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
  const [memberId, setMemberId] = useState<number | null>(null);
  const { sendMessageToWeb } = useWebView();

  const updateMemberId = useCallback((id: number) => {
    setMemberId(id);
  }, []);

  // 앱 종료 상태에서 알림을 탭한 경우
  const coldStartNotificationOpen = useCallback(async () => {
    try {
      const message = await messaging().getInitialNotification();
      if (!message) return;

      if (message.data?.notificationType === 'ARTICLE') {
        setTimeout(() => {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: { url: `/articles/${message.data?.articleId}` },
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
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(
      async (token) => {
        console.log('FCM 토큰이 갱신되었습니다');

        try {
          const deviceUuid = await getDeviceUUID();
          if (memberId && deviceUuid) {
            await putFCMToken({
              memberId,
              deviceUuid,
              token,
            });
            console.log('갱신된 FCM 토큰이 서버에 등록되었습니다.');
          }
        } catch (error) {
          console.error('FCM 토큰 갱신 등록 실패했습니다.', error);
        }
      },
    );

    // FCM 포그라운드 메시지 리스너: 앱이 열려있을 때 FCM 메시지를 받으면 즉시 로컬 알림으로 표시
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
    });

    // 백그라운드에서 알림을 탭한 경우
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        if (remoteMessage.data?.notificationType === 'ARTICLE') {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: { url: `/articles/${remoteMessage.data?.articleId}` },
          });
        }
      },
    );

    // 포그라운드에서 알림을 탭한 경우
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;

        if (data.notificationType === 'ARTICLE') {
          sendMessageToWeb({
            type: 'NOTIFICATION_ROUTING',
            payload: {
              url: `/articles/${data.articleId}`,
            },
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
  }, [coldStartNotificationOpen, sendMessageToWeb]);

  // memberId가 있으면 자동으로 FCM 토큰 등록
  useEffect(() => {
    if (!memberId) return;

    const registerToken = async () => {
      try {
        const lastRegisteredMemberId = await getLastRegisteredMemberId();
        if (!lastRegisteredMemberId || memberId !== lastRegisteredMemberId) {
          console.log('새로운 계정 감지, 기존 토큰 무효화');
          await setLastRegisteredMemberId(memberId);
          await deleteFCMToken();
        }

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

          sendMessageToWeb({
            type: 'REQUEST_NOTIFICATION_ACTIVE',
          });
        }
      } catch (error) {
        console.error('FCM 토큰 등록에 실패했습니다.', error);
      }
    };

    registerToken();
  }, [memberId, sendMessageToWeb]);

  useEffect(() => {
    createAndroidChannel();
  }, []);

  return {
    onNotification,
    updateMemberId,
  };
};

export default useNotification;
