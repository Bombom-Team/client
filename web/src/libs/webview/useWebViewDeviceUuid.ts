import {
  sendMessageToRN,
  addWebViewMessageListener,
} from '@bombom/shared/ui-web';
import { useEffect, useState } from 'react';

export const useWebViewDeviceUuid = () => {
  const [deviceUuid, setDeviceUuid] = useState('');

  useEffect(() => {
    sendMessageToRN({ type: 'REQUEST_DEVICE_UUID' });

    const unsubscribe = addWebViewMessageListener((message) => {
      if (message.type === 'DEVICE_UUID') {
        setDeviceUuid(message.payload.deviceUuid);
      }
    });

    return () => unsubscribe();
  }, []);

  return deviceUuid;
};
