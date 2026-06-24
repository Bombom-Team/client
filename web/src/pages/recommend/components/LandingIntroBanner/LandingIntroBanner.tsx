import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import landingCharacter from '#/assets/avif/landing-banner-cat.avif';

const LandingIntroBanner = () => {
  const device = useDevice();

  return (
    <Container device={device} to="/landing">
      <ContentArea>
        <TextWrapper>
          <TextGroup>
            <Title device={device}>봄봄이 처음이라면</Title>
            <Description device={device}>
              뉴스레터를 한곳에 모아 읽는 방법을 둘러보세요
            </Description>
          </TextGroup>
          <ActionText device={device}>서비스 소개 보기 →</ActionText>
        </TextWrapper>
        <CharacterImage
          src={landingCharacter}
          alt="봄봄 캐릭터"
          device={device}
        />
      </ContentArea>
    </Container>
  );
};

export default LandingIntroBanner;

const Container = styled(Link)<{ device: Device }>`
  overflow: hidden;
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0 48px' : '0 56px')};
  border: 1px solid rgb(254 94 4 / 12%);
  border-radius: 16px;
  box-shadow:
    0 2px 8px rgb(254 94 4 / 6%),
    0 4px 16px rgb(0 0 0 / 4%);

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      ellipse at top right,
      rgb(254 94 4 / 7%) 0%,
      transparent 55%
    ),
    linear-gradient(to bottom right, #fff8f5 0%, #fff 60%);

  cursor: pointer;

  @media (prefers-reduced-motion: no-preference) {
    transition:
      transform 200ms ease,
      box-shadow 200ms ease;

    &:hover {
      box-shadow:
        0 4px 12px rgb(254 94 4 / 10%),
        0 8px 24px rgb(0 0 0 / 6%);
      transform: translateY(-1px);
    }
  }
`;

const ContentArea = styled.div`
  width: 100%;
  max-width: 480px;

  display: flex;
  gap: 16px;
  align-items: center;
`;

const TextWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;
`;

const TextGroup = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Title = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t6Bold : theme.fonts.t8Bold};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t3Regular : theme.fonts.t4Regular};

  word-break: keep-all;
`;

const ActionText = styled.span<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '7px 12px' : '9px 14px')};
  border-radius: 100px;

  align-self: flex-start;

  background: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t4Bold};
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

const CharacterImage = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '110px' : '175px')};
  height: ${({ device }) => (device === 'mobile' ? '110px' : '175px')};

  flex-shrink: 0;

  object-fit: contain;
`;
