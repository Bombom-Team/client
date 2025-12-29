import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

export const useWebViewSendMemberId = () => {
  const { userProfile } = useAuth();

  useEffect(() => {
    if (!isWebView() || !userProfile?.id) return;

    sendMessageToRN({
      type: 'MEMBER_ID',
      payload: {
        memberId: userProfile.id,
      },
    });
  }, [userProfile?.id]);
};
