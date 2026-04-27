import { Button } from '@bombom/shared/ui-web';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

const BOMBOM_LOGIN_URL = 'https://bombom.news/login';

const LoginButton = () => {
  const handleLoginClick = () => {
    if (isWebView()) {
      sendMessageToRN({ type: 'SHOW_LOGIN_SCREEN' });
    } else {
      window.location.href = BOMBOM_LOGIN_URL;
    }

    trackEvent({
      category: 'Navigation',
      action: '로그인 버튼 클릭',
      label: 'Header Login Button',
    });
  };

  return <Button onClick={handleLoginClick}>로그인</Button>;
};

export default LoginButton;
