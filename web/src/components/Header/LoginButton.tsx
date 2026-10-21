import { Button, sendMessageToRN, isWebView } from '@bombom/shared/ui-web';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';

interface LoginButtonProps {
  className?: string;
}

const LoginButton = ({ className }: LoginButtonProps) => {
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const handleLoginClick = () => {
    if (isWebView())
      sendMessageToRN({
        type: 'SHOW_LOGIN_SCREEN',
      });
    else
      navigate({
        to: '/login',
        search: {
          redirect: `${window.location.pathname}${window.location.search}`,
        },
      });

    trackEvent({
      category: 'Navigation',
      action: '로그인 버튼 클릭',
      label: 'Header Login Button',
    });
  };

  if (isLoading) return null;

  return (
    <Button className={className} onClick={handleLoginClick}>
      로그인
    </Button>
  );
};

export default LoginButton;
