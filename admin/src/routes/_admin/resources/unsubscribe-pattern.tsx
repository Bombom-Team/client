import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/resources/unsubscribe-pattern')({
  component: UnsubscribePatternPage,
});

function UnsubscribePatternPage() {
  return (
    <Layout title="리소스 관리">
      <Container>
        <HeaderBox>
          <Title>구독 자동 취소 패턴</Title>
          <Description>구독 자동 취소 규칙/패턴 관리 화면입니다.</Description>
        </HeaderBox>

        <ActionBox>
          <Link to="/resources">
            <Button as="span" variant="secondary">
              목록으로
            </Button>
          </Link>
        </ActionBox>

        <NoticeBox>
          패턴 관리 기능은 아직 연결 전입니다. 다음 단계에서 API/폼을 연동하면
          됩니다.
        </NoticeBox>
      </Container>
    </Layout>
  );
}

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const HeaderBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionBox = styled.div`
  display: flex;
  justify-content: flex-end;

  & a {
    text-decoration: none;
  }
`;

const NoticeBox = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
