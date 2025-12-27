import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

export const useWebViewRegisterToken = () => {
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!isWebView() || !userProfile) return;

    sendMessageToRN({
      type: 'REGISTER_FCM_TOKEN_LOGGED_IN',
      payload: {
        memberId: userProfile.id,
      },
    });
  }, [userProfile]);
};
