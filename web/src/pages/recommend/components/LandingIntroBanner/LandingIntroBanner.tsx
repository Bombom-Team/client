import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import landingCharacter from '#/assets/avif/landing-banner-cat.avif';

const LandingIntroBanner = () => {
  const device = useDevice();

  return (
    <Container to="/landing">
      <Content>
        <TextWrapper>
          <TextGroup>
            <Title device={device}>
              <Highlight>봄봄</Highlight>이 처음이라면
            </Title>
            <Description device={device}>봄봄 서비스를 소개합니다.</Description>
          </TextGroup>
          <ActionText device={device}>서비스 소개 보기</ActionText>
        </TextWrapper>
        <CharacterImage src={landingCharacter} alt="봄봄 캐릭터" />
      </Content>
    </Container>
  );
};

export default LandingIntroBanner;

const Container = styled(Link)`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 0 clamp(40px, 5vw, 56px);
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      ellipse at top left,
      rgb(254 94 4 / 9%) 0%,
      rgb(254 94 4 / 4%) 44%,
      transparent 68%
    ),
    linear-gradient(135deg, #fff6ef 0%, #fffaf2 48%, #fff1e8 100%);

  cursor: pointer;
`;

const Content = styled.div`
  width: 100%;
  max-width: min(420px, 90%);

  display: grid;
  gap: 12px;
  align-items: center;

  grid-template-columns: 1fr auto;
`;

const TextWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const TextGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.p<{ device: Device }>`
  width: calc(100% + clamp(80px, 20vw, 175px) + 12px);

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') {
      return theme.fonts.t8Bold;
    }
    if (device === 'tablet') {
      return theme.fonts.t9Bold;
    }
    return theme.fonts.t12Bold;
  }};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') {
      return theme.fonts.t5Regular;
    }
    if (device === 'tablet') {
      return theme.fonts.t6Regular;
    }
    return theme.fonts.t7Regular;
  }};

  word-break: keep-all;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const ActionText = styled.span<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '4px 10px' : '8px 12px')};
  border-radius: 24px;

  align-self: flex-start;

  background: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t4Bold};
  letter-spacing: -0.01em;
  white-space: nowrap;
`;

const CharacterImage = styled.img`
  width: clamp(84px, 20vw, 175px);
  height: auto;
`;
