import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

const NotFoundCard = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  return (
    <Container isMobile={isMobile}>
      <StatusCode isMobile={isMobile}>404</StatusCode>

      <Title isMobile={isMobile}>페이지를 찾을 수 없어요</Title>

      <DescriptionWrapper>
        <Description>요청하신 페이지가 사라졌거나</Description>
        <Description>주소가 잘못 입력되었어요.</Description>
      </DescriptionWrapper>

      <GoHomeButton onClick={handleGoHome}>홈으로 돌아가기</GoHomeButton>
    </Container>
  );
};

export default NotFoundCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: 100%;
  height: 100dvh;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '24px')};

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatusCode = styled.strong<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t13Bold : theme.fonts.t15Bold};
`;

const Title = styled.h1<{ isMobile: boolean }>`
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t9Bold : theme.fonts.t11Bold};
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

const GoHomeButton = styled(Button)`
  margin-top: 12px;
  max-width: 380px;

  font: ${({ theme }) => theme.fonts.t7Bold};
`;
