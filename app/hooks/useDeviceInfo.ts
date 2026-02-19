import { useWebView } from '@/contexts/WebViewContext';
import { getDeviceUUID } from '@/utils/device';
import { checkNotificationPermission } from '@/utils/notification';
import { useCallback } from 'react';

export const useDeviceInfo = () => {
  const { sendMessageToWeb } = useWebView();

  const sendDeviceInfoToWeb = useCallback(async () => {
    try {
      const deviceUuid = await getDeviceUUID();
      if (deviceUuid) {
        sendMessageToWeb({
          type: 'DEVICE_UUID',
          payload: { deviceUuid },
        });
      }
    } catch (error) {
      console.error('디바이스 정보 전송 실패:', error);
    }
  }, [sendMessageToWeb]);

  const sendNotificationPermissionInfo = useCallback(async () => {
    try {
      const hasPermission = await checkNotificationPermission();
      sendMessageToWeb({
        type: 'NOTIFICATION_PERMISSION',
        payload: { hasPermission },
      });
    } catch (error) {
      console.error('알림 권한 정보 전송 실패:', error);
    }
  }, [sendMessageToWeb]);

  return {
    sendDeviceInfoToWeb,
    sendNotificationPermissionInfo,
  };
};
