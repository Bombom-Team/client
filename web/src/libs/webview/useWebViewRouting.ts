import { addWebViewMessageListener, isWebView } from '@bombom/shared/ui-web';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { RNToWebMessage } from '@bombom/shared';

const NOTIFICATION_TYPE_BY_URL_PREFIX = [
  { prefix: '/articles/', type: 'ARTICLE' },
  { prefix: '/event', type: 'EVENT' },
  { prefix: '/support/inquiry/', type: 'INQUIRY_MESSAGE_ARRIVAL' },
];

const getNotificationType = (url: string) =>
  NOTIFICATION_TYPE_BY_URL_PREFIX.find(({ prefix }) => url.startsWith(prefix))
    ?.type;

export const useWebViewRouting = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWebView()) return;

    const cleanup = addWebViewMessageListener((message: RNToWebMessage) => {
      if (message.type === 'NOTIFICATION_ROUTING') {
        trackEvent({
          category: 'Notification',
          action: '알림 열기',
          label: getNotificationType(message.payload.url),
        });
        navigate({
          to: message.payload.url,
        });
        return;
      }
    });

    return cleanup;
  }, [navigate]);
};
