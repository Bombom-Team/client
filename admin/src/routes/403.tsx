import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { FiAlertTriangle } from 'react-icons/fi';

export const Route = createFileRoute('/403')({
  component: ForbiddenPage,
});

function ForbiddenPage() {
  const handleGoHome = () => {
    window.location.href = window.location.origin + '/';
  };

  return (
    <Container>
      <Content>
        <IconWrapper>
          <FiAlertTriangle />
        </IconWrapper>
        <Title>403</Title>
        <Subtitle>접근 권한이 없습니다</Subtitle>
        <Description>
          이 페이지에 접근할 수 있는 권한이 없습니다.
          <br />
          관리자 권한이 필요한 페이지입니다.
        </Description>
        <HomeButton onClick={handleGoHome}>홈으로 가기</HomeButton>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}10 0%,
    ${({ theme }) => theme.colors.secondary}10 100%
  );
`;

const Content = styled.div`
  max-width: 500px;
  padding: ${({ theme }) => theme.spacing.xxl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  background-color: ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.error}15;
  color: ${({ theme }) => theme.colors.error};
  font-size: 40px;
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['3xl']};
`;

const Subtitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Description = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
`;

const HomeButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};

  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    transform: scale(0.98);
  }
`;
