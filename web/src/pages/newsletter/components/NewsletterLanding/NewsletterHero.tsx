import styled from '@emotion/styled';
import { useState } from 'react';
import MaeilMailSubscribeModal from './MaeilMailSubscribeModal';
import Flex from '@/components/Flex';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { NewsletterLandingConfig } from '../../types/subscribe';
import logo from '#/assets/avif/logo.avif';
import MaeilMailLogo from '#/assets/svg/maeilmail-logo.svg';

interface NewsletterHeroProps {
  config: NewsletterLandingConfig;
}

const NewsletterHero = ({ config }: NewsletterHeroProps) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { isLoggedIn, userProfile } = useAuth();
  const device = useDevice();
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const redirectLandingPage = () => {
    const redirect = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?redirect=${redirect}`;
  };

  const completeSubscription = () => {
    closeModal();
    setIsSubscribed(true);
  };

  return (
    <Container>
      <Content device={device}>
        <LogoRow device={device}>
          <Flex align="center" gap={10}>
            <BomBomLogo src={logo} alt="봄봄" device={device} />
            <Text color="textPrimary" font="t11Bold">
              봄봄
            </Text>
          </Flex>

          <CrossSign>×</CrossSign>

          <MaeilMailLogo width={device === 'mobile' ? 120 : 148} />
        </LogoRow>

        <HeroTitleSection>
          <HeadlineLine device={device}>
            이제{' '}
            <BrandGreen primaryColor={config.primaryColor}>매일메일</BrandGreen>
            도
          </HeadlineLine>
          <HeadlineLine device={device}>
            <BrandOrange>봄봄</BrandOrange>에서
          </HeadlineLine>
        </HeroTitleSection>

        <Flex align="center" gap={12}>
          <OpenDateNumber>{config.launchDate}</OpenDateNumber>
          <OpenDateLabel>OPEN</OpenDateLabel>
        </Flex>

        <Description>
          서비스 종료로 아쉬움을 남긴 매일메일을 봄봄에서 계속 만나보세요.
          <br />
          기술 면접 질문을 한곳에서 더 편하게 읽을 수 있어요.
        </Description>

        <CtaArea>
          {isSubscribed ? (
            <Flex align="center" gap={10}>
              <SuccessMark primaryColor={config.primaryColor}>✓</SuccessMark>
              사전 구독 완료! 오픈 시 봄봄에서 바로 읽을 수 있어요.
            </Flex>
          ) : isLoggedIn ? (
            <>
              <Flex align="center" gap={8}>
                <AccountDot />
                <SubText>{userProfile?.email}로 구독됩니다.</SubText>
              </Flex>
              <SubscribeButton onClick={openModal}>
                사전 구독하기
              </SubscribeButton>
            </>
          ) : (
            <SubscribeButton onClick={redirectLandingPage}>
              로그인하고 구독하기
            </SubscribeButton>
          )}
        </CtaArea>
      </Content>

      <MaeilMailSubscribeModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        onSubscribeSuccess={completeSubscription}
      />
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
  font: ${({ theme }) => theme.fonts.t10Regular};
`;

const HeadlineLine = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 900;
  font-size: ${({ device }) =>
    device === 'mobile' ? 'clamp(2.25rem, 9.5vw, 3rem)' : '4rem'};
  line-height: 1.1;
  letter-spacing: -0.03em;
`;

const BrandGreen = styled.span<{ primaryColor: string }>`
  color: ${({ primaryColor }) => primaryColor};
`;

const BrandOrange = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const HeroTitleSection = styled(Flex)`
  gap: 4px;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const Description = styled.p`
  max-width: 480px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
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
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const SuccessMark = styled.span<{ primaryColor: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ primaryColor }) => primaryColor};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const AccountDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const SubText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
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
  font: ${({ theme }) => theme.fonts.t6Bold};

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
  font: ${({ theme }) => theme.fonts.t13Bold};
  letter-spacing: -0.02em;
`;

const OpenDateLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.t13Bold};
  letter-spacing: 0.04em;
`;
