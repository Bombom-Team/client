import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useWebView } from '@/contexts/WebViewContext';
import { checkNotificationPermission } from '@/utils/notification';

export const useNotificationPermission = () => {
  const { sendMessageToWeb } = useWebView();
  const permissionRef = useRef<boolean | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const sendPermissionToWeb = useCallback(async () => {
    try {
      const hasPermission = await checkNotificationPermission();
      permissionRef.current = hasPermission;

      sendMessageToWeb({
        type: 'NOTIFICATION_PERMISSION',
        payload: { hasPermission },
      });
    } catch (error) {
      console.error('알림 권한 전송 실패:', error);
    }
  }, [sendMessageToWeb]);

  useEffect(() => {
    const updatePermission = async () => {
      try {
        const hasPermission = await checkNotificationPermission();

        if (permissionRef.current !== hasPermission) {
          permissionRef.current = hasPermission;
          sendMessageToWeb({
            type: 'NOTIFICATION_PERMISSION',
            payload: { hasPermission },
          });
        }
      } catch (error) {
        console.error('알림 권한 확인 실패:', error);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const previousAppState = appStateRef.current;
        appStateRef.current = nextAppState;

        if (
          previousAppState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          updatePermission();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [sendMessageToWeb]);

  return {
    sendPermissionToWeb,
  };
};
