import { sendMessageToRN, isWebView } from '@bombom/shared/ui-web';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useWebViewRegisterToken = () => {
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!isWebView() || !userProfile?.id) return;

    sendMessageToRN({
      type: 'REGISTER_FCM_TOKEN',
      payload: {
        memberId: userProfile.id,
      },
    });
  }, [userProfile?.id]);
};
