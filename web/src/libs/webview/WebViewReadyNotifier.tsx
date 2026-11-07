import { sendMessageToRN, isWebView } from '@bombom/shared/ui-web';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// 앱은 이 신호를 받은 뒤 알림 이동을 보낸다. 프로필 조회가 끝나야 첫 방문 리다이렉트가 이동을 되돌리지 않는다.
const WebViewReadyNotifier = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isWebView() || isLoading) return;

    sendMessageToRN({ type: 'WEB_READY' });
  }, [isLoading]);

  return null;
};

export default WebViewReadyNotifier;
