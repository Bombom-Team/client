import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import { navigateToOAuthLogin } from '@/utils/auth';
import { isIOS, isWebView } from '@/utils/device';
import AppleIcon from '#/assets/svg/apple.svg';
import GoogleIcon from '#/assets/svg/google.svg';
import SparklesIcon from '#/assets/svg/sparkles.svg';

const LoginCard = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <GreetingWrapper isMobile={isMobile}>
        <IconWrapper>
          <SparklesIcon
            width={24}
            height={24}
            fill={theme.colors.white}
            color={theme.colors.white}
          />
        </IconWrapper>
        <GreetingTitle>봄봄에 오신 걸 환영해요</GreetingTitle>
        <GreetingMessage isMobile={isMobile}>
          당신의 하루에 찾아오는 작은 설렘{'\n'}뉴스레터를 한 곳에서 쉽게
          관리하세요
        </GreetingMessage>
      </GreetingWrapper>
      <Divider />
      <LoginButton
        onClick={() => {
          navigateToOAuthLogin({ provider: 'google' });
        }}
        variant="outlined"
      >
        <GoogleIcon width={24} height={24} fill="black" />
        Google로 계속하기
      </LoginButton>
      {(!isWebView() || isIOS()) && (
        <LoginButton
          onClick={() => {
            navigateToOAuthLogin({ provider: 'apple' });
          }}
          variant="outlined"
        >
          <AppleIcon width={24} height={24} fill="black" />
          Apple로 계속하기
        </LoginButton>
      )}
      <Terms>
        로그인하시면 봄봄의 <Highlight>서비스 약관</Highlight>과
        <Highlight>개인정보 처리방침</Highlight>에{'\n'}
        동의하는 것으로 간주됩니다.
      </Terms>
    </Container>
  );
};

export default LoginCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: min(100%, 26.25rem);
  padding: 1.75rem;

  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ isMobile }) =>
    !isMobile &&
    `
    border-radius: 1.25rem;
    box-shadow: 0 1.5625rem 3.125rem -0.75rem rgb(0 0 0 / 25%);
    background-color: ${theme.colors.white};
  
  `}
`;

const GreetingWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1rem' : '1.25rem')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  padding: 1.125rem;
  border-radius: 50%;
  box-shadow:
    0 1.25rem 1.5625rem -0.3125rem
      ${({ theme }) => `${theme.colors.primaryLight}40`},
    0 0.625rem 0.625rem -0.3125rem
      ${({ theme }) => `${theme.colors.primaryLight}20`};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const GreetingTitle = styled.h2`
  background: linear-gradient(107deg, #181818 0%, #f96 100%);
  background-clip: text;
  font: ${({ theme }) => theme.fonts.heading3};
  text-align: center;

  -webkit-text-fill-color: transparent;
`;

const GreetingMessage = styled.p<{ isMobile: boolean }>`
  margin: ${({ isMobile }) => (isMobile ? '1.5rem' : '2.125rem')};

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 400;
  text-align: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.125rem;
  margin-bottom: 2.125rem;

  background: linear-gradient(
    90deg,
    rgb(237 237 237 / 0%) 0%,
    ${({ theme }) => theme.colors.dividers} 50%,
    rgb(237 237 237 / 0%) 100%
  );
`;

const LoginButton = styled(Button)`
  width: 100%;
  padding: 0.75rem;
  box-shadow: 0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 5%);

  font: ${({ theme }) => theme.fonts.body1};
`;

const Terms = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
  text-align: center;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;
