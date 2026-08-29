import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdStar, MdStarBorder } from 'react-icons/md';
import { noticesQueries } from '@/apis/notices/notices.query';
import { type Notice, NOTICE_CATEGORY_LABELS } from '@/types/notice';

export function NoticeList({ notices }: { notices: Notice[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteNotice } = useMutation({
    ...noticesQueries.mutation.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueries.all });
    },
  });

  const { mutate: setRepresentative } = useMutation({
    ...noticesQueries.mutation.setRepresentative(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueries.all });
    },
  });

  const handleDelete = (noticeId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNotice(noticeId);
    }
  };

  // 대표는 딱 1개 — 활성 별을 다시 누르면 해제, 다른 걸 누르면 교체(서버가 이전 대표 해제)
  const handleToggleRepresentative = (notice: Notice) => {
    setRepresentative({
      noticeId: notice.id,
      isRepresentative: !notice.isRepresentative,
    });
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
        <NoticeItem
          key={notice.id}
          onClick={() =>
            navigate({
              to: '/notices/$noticeId',
              params: { noticeId: notice.id.toString() },
            })
          }
        >
          <NoticeHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CategoryBadge category={notice.noticeCategory}>
                {NOTICE_CATEGORY_LABELS[notice.noticeCategory] ??
                  notice.noticeCategory}
              </CategoryBadge>
              <NoticeTitle>{notice.title}</NoticeTitle>
            </div>
            <NoticeActions>
              <IconButton
                $active={notice.isRepresentative}
                title={
                  notice.isRepresentative
                    ? '대표 공지 해제'
                    : '대표 공지로 지정'
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleRepresentative(notice);
                }}
              >
                {notice.isRepresentative ? (
                  <MdStar size={18} />
                ) : (
                  <MdStarBorder size={18} />
                )}
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    to: '/notices/$noticeId/edit',
                    params: { noticeId: notice.id.toString() },
                  });
                }}
              >
                <FiEdit size={18} />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(notice.id);
                }}
              >
                <FiTrash2 size={18} />
              </IconButton>
            </NoticeActions>
          </NoticeHeader>
          <NoticeMeta>
            <DateText>{notice.createdAt}</DateText>
          </NoticeMeta>
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
  margin-bottom: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const NoticeActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: transparent;
  color: ${({ theme, $active }) => ($active ? '#F59E0B' : theme.colors.gray600)};

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme, $active }) =>
      $active ? '#F59E0B' : theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const NoticeMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const CategoryBadge = styled.span<{ category: string }>`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
