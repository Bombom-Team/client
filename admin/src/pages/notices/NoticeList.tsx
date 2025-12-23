import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNotices } from '@/contexts/NoticeContext';
import type { Notice } from '@/types/notice';

export function NoticeList({ notices }: { notices: Notice[] }) {
  const { deleteNotice } = useNotices();

  const handleEdit = (noticeId: number) => {
    alert(`공지사항 ID ${noticeId}를 수정합니다. (수정 기능은 아직 미구현)`);
  };

  const handleDelete = (noticeId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNotice(noticeId);
    }
  };

  if (notices.length === 0) {
    return (
      <EmptyState>
        <p>등록된 공지사항이 없습니다.</p>
      </EmptyState>
    );
  }

  return (
    <Container>
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
              {/* NoticeMeta removed as API does not provide author/date/views */}
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
    </Container>
  );
}

const Container = styled.div`
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

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;
