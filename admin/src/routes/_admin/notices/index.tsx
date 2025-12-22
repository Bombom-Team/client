import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { useNotices } from '@/contexts/NoticeContext';
import { NoticeList } from '@/pages/notices/NoticeList';

export const Route = createFileRoute('/_admin/notices/')({
  component: NoticesPage,
});

function NoticesPage() {
  const { notices } = useNotices();

  return (
    <Layout title="공지사항">
      <Container>
        <Header>
          <Title>공지사항 ({notices.length}개)</Title>
          <Link to="/notices/new">
            <Button>
              <FiPlus style={{ marginRight: '8px' }} />새 공지사항
            </Button>
          </Link>
        </Header>

        <NoticeList notices={notices} />
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;
