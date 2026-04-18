import styled from '@emotion/styled';
import { useState } from 'react';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { toast } from '@/components/Toast/utils/toastActions';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { NewsletterLandingConfig } from '../../constants/newsletter';
import logo from '#/assets/avif/logo.avif';
import MailMaeilLogo from '#/assets/svg/mailmaeil-logo.svg';

interface Props {
  config: NewsletterLandingConfig;
}

const NewsletterHero = ({ config }: Props) => {
  const { isLoggedIn, userProfile } = useAuth();
  const device = useDevice();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeNewsletter = () => {
    // TODO: API 연동 - 사전 구독자 등록 엔드포인트 호출
    setIsSubscribed(true);
    toast.success('사전 구독이 완료되었습니다!');
  };

  const redirectLandingPage = () => {
    const redirect = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?redirect=${redirect}`;
  };

  return (
    <Container>
      <Content device={device}>
        <LogoRow device={device}>
          <Flex align="center" gap={10}>
            <BomBomLogo src={logo} alt="봄봄" device={device} />
            <Text color="textPrimary" font="heading3">
              봄봄
            </Text>
          </Flex>

          <CrossSign>×</CrossSign>

          <MailMaeilLogo width={device === 'mobile' ? 120 : 148} />
        </LogoRow>

        <Flex
          direction="column"
          align="center"
          gap={4}
          style={{ textAlign: 'center' }}
        >
          <HeadlineLine device={device}>
            이제 <BrandGreen>매일메일</BrandGreen>도
          </HeadlineLine>
          <HeadlineLine device={device}>
            <BrandOrange>봄봄</BrandOrange>에서
          </HeadlineLine>
        </Flex>

        <Description>
          서비스 종료로 아쉬움을 남긴 매일메일을 봄봄에서 계속 만나보세요.
          <br />
          기술 면접 질문을 한곳에서 더 편하게 읽을 수 있어요.
        </Description>

        <CtaArea>
          {isSubscribed ? (
            <Flex align="center" gap={10}>
              <SuccessMark color={config.primaryColor}>✓</SuccessMark>
              사전 구독 완료! 오픈 시 봄봄에서 바로 읽을 수 있어요.
            </Flex>
          ) : isLoggedIn ? (
            <>
              <Flex align="center" gap={8}>
                <AccountDot color={config.primaryColor} />
                <SubText>{userProfile?.email}로 구독됩니다.</SubText>
              </Flex>
              <SubscribeButton onClick={subscribeNewsletter}>
                사전 구독하기
              </SubscribeButton>
            </>
          ) : (
            <SubscribeButton onClick={redirectLandingPage}>
              로그인하고 구독하기
            </SubscribeButton>
          )}
        </CtaArea>

        <Flex align="center" gap={12}>
          <OpenDateNumber>{config.launchDate}</OpenDateNumber>
          <OpenDateLabel>오픈 예정</OpenDateLabel>
        </Flex>
      </Content>
    </Container>
  );
};

export default NewsletterHero;

const Container = styled.div`
  height: 85vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.main<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '100%' : '560px')};
  padding: ${({ device }) => (device === 'mobile' ? '0 24px' : '0 32px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const LogoRow = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '24px')};
  align-items: center;
  justify-content: center;
`;

const BomBomLogo = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '32px' : '44px')};
  height: ${({ device }) => (device === 'mobile' ? '32px' : '44px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '10px' : '14px')};
  box-shadow:
    0 2px 0 oklch(15% 0.02 55deg / 12%),
    0 4px 12px oklch(15% 0.02 55deg / 10%);
`;

const CrossSign = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font-weight: 300;
  font-size: 1.5rem;
`;

const HeadlineLine = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 900;
  font-size: ${({ device }) =>
    device === 'mobile' ? 'clamp(2.25rem, 9.5vw, 3rem)' : '4rem'};
  line-height: 1.1;
  letter-spacing: -0.03em;
`;

const BrandGreen = styled.span`
  color: #17c881;
`;

const BrandOrange = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p`
  max-width: 480px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  letter-spacing: -0.01em;
  text-align: center;
`;

const CtaArea = styled.div`
  width: 100%;
  max-width: 480px;

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  font-size: 0.9375rem;
`;

const SuccessMark = styled.span<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ color }) => color};
  color: #fff;
  font-size: 0.75rem;
`;

const AccountDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  flex-shrink: 0;

  background-color: ${({ color }) => color};
`;

const SubText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;

const SubscribeButton = styled.button`
  width: 100%;
  height: 52px;
  padding: 0 24px;
  border: none;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: oklch(15% 0.02 55deg);
  color: #f5f0e8;
  font-weight: 700;
  font-size: 0.9375rem;

  transition: background-color 150ms ease;

  &:hover {
    background-color: oklch(22% 0.02 55deg);
  }

  &:active {
    background-color: oklch(12% 0.02 55deg);
  }
`;

const OpenDateNumber = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  font-size: 2.1rem;
  letter-spacing: -0.02em;
`;

const OpenDateLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  font-size: 2.1rem;
  letter-spacing: 0.04em;
`;
