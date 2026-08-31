import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import { getRedirectPathFromSearch, navigateToOAuthLogin } from '@/utils/auth';
import { isIOS, isWebView } from '@/utils/device';
import { isInAppBrowser } from '@/utils/inAppBrowser';
import logo from '#/assets/avif/logo.avif';
import AppleIcon from '#/assets/svg/apple.svg';
import GoogleIcon from '#/assets/svg/google.svg';

const LoginCard = () => {
  const device = useDevice();
  const navigate = useNavigate();
  const isMobile = device === 'mobile';
  const redirectPath = getRedirectPathFromSearch(window.location.search);

  const handleGoogleLogin = () => {
    // 인앱브라우저에서는 구글 OAuth가 차단되므로 안내 화면으로 이동시킨다.
    if (isInAppBrowser()) {
      navigate({ to: '/login-guide' });
      return;
    }
    navigateToOAuthLogin({ provider: 'google', redirectPath });
  };

  return (
    <Container isMobile={isMobile}>
      <GreetingWrapper>
        <LogoImage src={logo} alt="봄봄 로고" />
        <GreetingTitle>봄봄에 오신 걸 환영해요</GreetingTitle>
        <GreetingMessage>
          당신의 하루에 찾아오는 작은 설렘 뉴스레터를 한 곳에서 쉽게 관리하세요
        </GreetingMessage>
      </GreetingWrapper>
      <Divider />
      <LoginButton onClick={handleGoogleLogin} variant="outlined">
        <GoogleIcon width={24} height={24} fill="black" />
        Google로 계속하기
      </LoginButton>
      {(!isWebView() || isIOS()) && (
        <LoginButton
          onClick={() => {
            navigateToOAuthLogin({ provider: 'apple', redirectPath });
          }}
          variant="outlined"
        >
          <AppleIcon width={24} height={24} fill="black" />
          Apple로 계속하기
        </LoginButton>
      )}
      <Terms>
        로그인하시면 봄봄의 <Highlight>서비스 약관</Highlight>과{' '}
        <Highlight>개인정보 처리방침</Highlight>에{'\n'}
        동의하는 것으로 간주됩니다.
      </Terms>
    </Container>
  );
};

export default LoginCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: 100%;
  max-width: ${({ isMobile }) => (isMobile ? '420px' : '460px')};
  padding: ${({ isMobile }) => (isMobile ? '28px' : '48px 40px')};

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ isMobile }) =>
    !isMobile &&
    `
    border-radius: 20px;
    background-color: ${theme.colors.white};
  
  `}
`;

const GreetingWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 16px;
`;

const GreetingTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
  text-align: center;
`;

const GreetingMessage = styled.p`
  width: 100%;
  max-width: 380px;
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t7Regular};
  text-align: center;
  white-space: normal;

  text-wrap: balance;

  word-break: keep-all;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin: 16px 0;

  background: linear-gradient(
    90deg,
    rgb(237 237 237 / 0%) 0%,
    ${({ theme }) => theme.colors.dividers} 50%,
    rgb(237 237 237 / 0%) 100%
  );
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 5%);

  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Terms = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  text-align: center;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;
