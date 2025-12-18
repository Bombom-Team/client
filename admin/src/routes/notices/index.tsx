import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { FiEdit, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { useNotices } from '@/contexts/NoticeContext';

export const Route = createFileRoute('/notices/')({
  component: NoticesPage,
});

function NoticesPage() {
  const { notices, deleteNotice } = useNotices();

  const handleEdit = (noticeId: number) => {
    alert(`공지사항 ID ${noticeId}를 수정합니다. (수정 기능은 아직 미구현)`);
  };

  const handleDelete = (noticeId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNotice(noticeId);
    }
  };

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

        {notices.length === 0 ? (
          <EmptyState>
            <p>등록된 공지사항이 없습니다.</p>
          </EmptyState>
        ) : (
          <NoticeList>
            {notices.map((notice) => (
              <NoticeItem key={notice.id}>
                <NoticeHeader>
                  <div>
                    <Link
                      to="/notices/$noticeId"
                      params={{ noticeId: notice.id.toString() }}
                    >
                      <NoticeTitle>{notice.title}</NoticeTitle>
                    </Link>
                    <NoticeMeta>
                      <span>{notice.author}</span>
                      <span>•</span>
                      <span>{notice.createdAt}</span>
                      <span>•</span>
                      <ViewCount>
                        <FiEye />
                        <span>{notice.views}</span>
                      </ViewCount>
                    </NoticeMeta>
                  </div>
                  <NoticeActions>
                    <IconButton onClick={() => handleEdit(notice.id)}>
                      <FiEdit size={18} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(notice.id)}>
                      <FiTrash2 size={18} />
                    </IconButton>
                  </NoticeActions>
                </NoticeHeader>
              </NoticeItem>
            ))}
          </NoticeList>
        )}
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

const NoticeList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const NoticeItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NoticeHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const NoticeTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const NoticeMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const NoticeActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray600};

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ViewCount = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;
