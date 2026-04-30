import { Button } from '@bombom/shared/ui-web';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

const MAEIL_MAIL_URL = 'https://maeilmail.bombom.news';
const BOMBOM_LOGIN_URL = `https://www.bombom.news/login?redirect=${encodeURIComponent(MAEIL_MAIL_URL)}`;

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
