import { useWebView } from '@/contexts/WebViewContext';
import { getDeviceUUID } from '@/utils/device';
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

  return {
    sendDeviceInfoToWeb,
  };
};
