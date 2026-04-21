import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { MAEIL_MAIL_LANDING_CONFIG } from '@/pages/newsletter/constants/subscribe';
import logo from '#/assets/avif/logo.avif';
import MaeilMailLogo from '#/assets/svg/maeilmail-logo.svg';

const MaeilMailPromotionBanner = () => {
  const device = useDevice();

  return (
    <Container device={device} to="/maeil-mail/landing">
      <Content device={device}>
        <LogoRow device={device}>
          <Flex align="center" gap={10}>
            <BomBomLogo src={logo} alt="봄봄" device={device} />
            <Text
              color="textPrimary"
              font={device === 'mobile' ? 't6Bold' : 't8Bold'}
            >
              봄봄
            </Text>
          </Flex>

          <CrossSign>×</CrossSign>

          <MaeilMailLogo width={device === 'mobile' ? 80 : 100} />
        </LogoRow>

        <HeroTitleSection>
          <HeadlineLine device={device}>
            이제{' '}
            <BrandGreen primaryColor={MAEIL_MAIL_LANDING_CONFIG.primaryColor}>
              매일메일
            </BrandGreen>
            도
          </HeadlineLine>
          <HeadlineLine device={device}>
            <BrandOrange>봄봄</BrandOrange>에서
          </HeadlineLine>
        </HeroTitleSection>

        <Flex align="center" gap={8}>
          <OpenDateNumber device={device}>
            {MAEIL_MAIL_LANDING_CONFIG.launchDate}
          </OpenDateNumber>
          <OpenDateLabel device={device}>Coming Soon</OpenDateLabel>
        </Flex>
      </Content>
    </Container>
  );
};

export default MaeilMailPromotionBanner;

const Container = styled(Link)<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: ${({ device }) => (device ? '32px 36px' : '24px 20px')};
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f4f1e7;
`;

const Content = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '100%' : '560px')};
  padding: ${({ device }) => (device === 'mobile' ? '0 24px' : '0 32px')};

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
`;

const LogoRow = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  align-items: center;
  justify-content: center;
`;

const BomBomLogo = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  box-shadow:
    0 2px 0 oklch(15% 0.02 55deg / 12%),
    0 4px 12px oklch(15% 0.02 55deg / 10%);
`;

const CrossSign = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t8Regular};
`;

const HeadlineLine = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t14Bold : theme.fonts.t16Bold};
`;

const BrandGreen = styled.span<{ primaryColor: string }>`
  color: ${({ primaryColor }) => primaryColor};
`;

const BrandOrange = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const HeroTitleSection = styled(Flex)`
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const OpenDateNumber = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.t6Bold : theme.fonts.t8Bold};
  letter-spacing: -0.02em;
`;

const OpenDateLabel = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.t6Bold : theme.fonts.t8Bold};
  letter-spacing: 0.04em;
`;
