import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/resources/')({
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <Layout title="리소스 관리">
      <Container>
        <HeaderBox>
          <Title>관리 목록</Title>
          <Description>
            운영 리소스별 관리 화면으로 이동할 수 있습니다.
          </Description>
        </HeaderBox>

        <ListBox>
          <ListHeader>
            <HeaderCell>이름</HeaderCell>
            <HeaderCell>설명</HeaderCell>
            <HeaderCell>관리</HeaderCell>
          </ListHeader>

          <ListRow>
            <RowName>구독 자동 취소 Lambda</RowName>
            <RowDescription>Dev Lambda Playwright JS 코드 조회</RowDescription>
            <ActionCell>
              <Link to="/resources/unsubscribe-lambda">
                <Button as="span">관리하기</Button>
              </Link>
            </ActionCell>
          </ListRow>

          <ListRow>
            <RowName>구독 자동 취소 패턴</RowName>
            <RowDescription>패턴 목록/규칙 관리</RowDescription>
            <ActionCell>
              <Link to="/resources/unsubscribe-pattern">
                <Button as="span">관리하기</Button>
              </Link>
            </ActionCell>
          </ListRow>
        </ListBox>
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

const ListBox = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ListHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: grid;
  align-items: center;

  background: ${({ theme }) => theme.colors.gray50};

  grid-template-columns: 220px 1fr 140px;
`;

const HeaderCell = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ListRow = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  display: grid;
  align-items: center;

  grid-template-columns: 220px 1fr 140px;
`;

const RowName = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const RowDescription = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionCell = styled.div`
  display: flex;
  justify-content: flex-end;

  & a {
    text-decoration: none;
  }
`;
