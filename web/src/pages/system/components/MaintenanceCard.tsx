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

      <MaintenanceTimeWrapper isMobile={isMobile}>
        점검 시간: 27일(목) 오후 4시 ~ 28일(금) 오전 6시
      </MaintenanceTimeWrapper>

      <DescriptionWrapper isMobile={isMobile}>
        <Description>서버 이전 작업이 예정되어 있습니다.</Description>
        <Description>더 나은 서비스를 위한 필수 작업으로,</Description>
        <Description>상황에 따라 점검 시간이 길어질 수 있습니다.</Description>
      </DescriptionWrapper>

      <ContactWrapper isMobile={isMobile}>
        <Contact href="https://e0pq0.channel.io/" isMobile={isMobile}>
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
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const MaintenanceTimeWrapper = styled.div<{ isMobile: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;

  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.heading5};
  text-align: center;
`;

const DescriptionWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const Description = styled.p``;

const ContactWrapper = styled.div<{ isMobile: boolean }>`
  margin-top: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
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
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.heading6};

  text-decoration: none;

  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ContactDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
`;
