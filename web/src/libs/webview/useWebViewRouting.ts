import { addWebViewMessageListener, isWebView } from '@bombom/shared/ui-web';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { RNToWebMessage } from '@bombom/shared';

export const useWebViewRouting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWebView()) return;

    const cleanup = addWebViewMessageListener((message: RNToWebMessage) => {
      if (message.type === 'NOTIFICATION_ROUTING') {
        navigate({
          to: message.payload.url,
        });
        return;
      }
    });

    return cleanup;
  }, [navigate]);
};
