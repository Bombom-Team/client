import {
  addWebViewMessageListener,
  sendMessageToRN,
  isWebView,
} from '@bombom/shared/ui-web';
import { useEffect, useState } from 'react';
import type { RNToWebMessage } from '@bombom/shared/webview';

export const useWebViewNotificationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isWebView()) return;

    sendMessageToRN({ type: 'CHECK_NOTIFICATION_PERMISSION' });

    const cleanup = addWebViewMessageListener((message: RNToWebMessage) => {
      if (message.type === 'NOTIFICATION_PERMISSION') {
        setHasPermission(message.payload.hasPermission);
      }
    });

    return cleanup;
  }, []);

  return { hasPermission };
};
