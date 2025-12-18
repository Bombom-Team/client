import { useEffect } from 'react';
import { useWebViewDeviceUuid } from './useWebViewDeviceUuid';
import { addWebViewMessageListener } from './webview.utils';
import { useAuth } from '@/contexts/AuthContext';
import useNotificationMutation from '@/pages/MyPage/useNotificationMutation';
import { isWebView } from '@/utils/device';
import type { RNToWebMessage } from '@bombom/shared/webview';

export const useWebViewNotificationActive = () => {
  const { userProfile } = useAuth();
  const deviceUuid = useWebViewDeviceUuid();

  const { mutate: updateNotificationSettings } = useNotificationMutation({
    memberId: userProfile?.id ?? 0,
    deviceUuid,
  });

  useEffect(() => {
    if (!isWebView()) return;
    if (!userProfile?.id || deviceUuid.length === 0) return;

    const cleanup = addWebViewMessageListener((message: RNToWebMessage) => {
      if (message.type === 'REQUEST_NOTIFICATION_ACTIVE') {
        updateNotificationSettings(true);
      }
    });

    return cleanup;
  }, [deviceUuid, updateNotificationSettings, userProfile?.id]);
};
