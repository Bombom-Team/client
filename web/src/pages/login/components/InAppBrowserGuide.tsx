import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import { navigateToOAuthLogin } from '@/utils/auth';
import { downloadApp } from '@/utils/downloadApp';
import { getResponsiveValue } from '@/utils/responsive';
import type { Device } from '@/hooks/useDevice';
import logo from '#/assets/avif/logo.avif';
import AppleIcon from '#/assets/svg/apple.svg';

const InAppBrowserGuide = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleAppleLogin = () => {
    navigateToOAuthLogin({ provider: 'apple' });
  };

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <Card isMobile={isMobile}>
          <LogoWrapper>
            <LogoImage src={logo} alt="봄봄 로고" />
          </LogoWrapper>
          <Title>인앱브라우저에서는{'\n'}구글 로그인이 어려워요</Title>
          <Description>
            카카오톡·인스타그램 등 인앱브라우저에서는 보안 정책상{'\n'}구글
            로그인이 제한돼요.{'\n'}봄봄 앱에서 1초 만에 로그인할 수 있어요.
          </Description>
          <Divider />
          <ActionButton onClick={downloadApp}>봄봄 앱에서 열기</ActionButton>
          <ActionButton onClick={handleAppleLogin} variant="outlined">
            <AppleIcon width={24} height={24} fill="black" />
            Apple로 계속하기
          </ActionButton>
          <BackLink to="/login" device={device}>
            ← 로그인으로 돌아가기
          </BackLink>
        </Card>
      </ContentWrapper>
    </Container>
  );
};

export default InAppBrowserGuide;

const Container = styled.main<{ device: Device }>`
  min-height: 100vh;
  padding: ${({ device }) => getResponsiveValue(device, 16, 24, 32)};

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ device, theme }) =>
    device === 'mobile'
      ? theme.colors.white
      : `linear-gradient(135deg, ${theme.colors.primaryBomBom} 0%, #f74 25%, ${theme.colors.primaryLight} 100%)`};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${({ device }) => getResponsiveValue(device, 400, 520, 600)};

  display: flex;
  gap: ${({ device }) => getResponsiveValue(device, 20, 28, 32)};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Card = styled.section<{ isMobile: boolean }>`
  width: min(100%, 420px);
  padding: 28px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ isMobile }) =>
    !isMobile &&
    `
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    background-color: ${theme.colors.white};
  `}
`;

const LogoWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow:
    0 20px 25px -5px ${({ theme }) => `${theme.colors.primaryLight}40`},
    0 10px 10px -5px ${({ theme }) => `${theme.colors.primaryLight}20`};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const LogoImage = styled.img`
  width: 32px;
  height: 32px;

  object-fit: contain;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;
  white-space: pre-line;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
  white-space: pre-line;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 34px;

  background: linear-gradient(
    90deg,
    rgb(237 237 237 / 0%) 0%,
    ${({ theme }) => theme.colors.dividers} 50%,
    rgb(237 237 237 / 0%) 100%
  );
`;

const ActionButton = styled(Button)`
  width: 100%;
  padding: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 5%);

  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const BackLink = styled(Link)<{ device: Device }>`
  color: ${({ device, theme }) =>
    device === 'mobile' ? theme.colors.textSecondary : theme.colors.white};
  font: ${({ theme }) => theme.fonts.t5Regular};

  text-decoration: none;
`;
