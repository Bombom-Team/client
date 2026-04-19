import styled from '@emotion/styled';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice } from '@/hooks/useDevice';
import maintenanceBom from '#/assets/avif/maintenance-bom.avif';

const MaintenanceCard = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <MaintenanceImage
        src={maintenanceBom}
        alt="점검 중 이미지"
        isMobile={isMobile}
      />

      <Title isMobile={isMobile}>서비스 점검 중입니다</Title>

      <DescriptionWrapper>
        <Description>
          더 나은 서비스 제공을 위해 시스템을 점검하고 있습니다.
        </Description>
        <Description>
          잠시만 기다려 주시면 곧 정상 서비스로 돌아오겠습니다.
        </Description>
      </DescriptionWrapper>

      <ContactWrapper>
        <Contact isMobile={isMobile} href="https://e0pq0.channel.io/">
          💬 채널톡 바로가기
        </Contact>
        <ContactDescription>
          긴급한 문의사항이 있으시면
          <br />
          채널톡으로 연락해 주세요.
        </ContactDescription>
      </ContactWrapper>
    </Container>
  );
};

export default MaintenanceCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: 100%;
  height: 100dvh;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MaintenanceImage = styled(ImageWithFallback, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '240px' : '280px')};
  height: ${({ isMobile }) => (isMobile ? '240px' : '280px')};
`;

const Title = styled.h1<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t11Bold : theme.fonts.t13Bold};
`;

const DescriptionWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Description = styled.p``;

const ContactWrapper = styled.div`
  margin-top: 12px;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const Contact = styled.a<{ isMobile: boolean }>`
  padding: 8px 16px;
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t5Regular : theme.fonts.t6Bold};

  text-decoration: none;

  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ContactDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;
