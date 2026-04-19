import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  blogQueries,
  useCreateDraft,
  useDeleteDraft,
} from '@/apis/blog/blog.query';
import { Layout } from '@/components/Layout';
import { Route } from '@/routes/_admin/blog/index';

type Tab = 'drafts' | 'published';

const formatPostDate = (date?: string) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('ko-KR');
};

const formatPostMeta = (publishedAt?: string, updatedAt?: string) => {
  const publishedDate = formatPostDate(publishedAt);
  const updatedDate = formatPostDate(updatedAt);
  const parts = [
    publishedDate ? `발행 ${publishedDate}` : null,
    updatedDate ? `수정 ${updatedDate}` : null,
  ].filter((value): value is string => value !== null);

  return parts.join(' · ') || '날짜 정보 없음';
};

const DraftList = ({
  onEdit,
  onDeleteRequest,
  confirmDeleteId,
  onConfirmDelete,
  onCancelDelete,
}: {
  onEdit: (postId: number) => void;
  onDeleteRequest: (postId: number) => void;
  confirmDeleteId: number | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) => {
  const { data: drafts } = useSuspenseQuery(blogQueries.drafts());
  if (drafts.length === 0) {
    return <EmptyState>임시저장된 글이 없습니다.</EmptyState>;
  }
  return (
    <PostList>
      {drafts.map((draft) => (
        <PostItem key={draft.postId}>
          <PostTitle>{draft.title || '(제목 없음)'}</PostTitle>
          {confirmDeleteId === draft.postId ? (
            <ConfirmActions>
              <ConfirmText>정말 삭제할까요?</ConfirmText>
              <ActionButton $danger onClick={onConfirmDelete} type="button">
                확인
              </ActionButton>
              <ActionButton onClick={onCancelDelete} type="button">
                취소
              </ActionButton>
            </ConfirmActions>
          ) : (
            <PostActions>
              <ActionButton onClick={() => onEdit(draft.postId!)} type="button">
                수정
              </ActionButton>
              <ActionButton
                $danger
                onClick={() => onDeleteRequest(draft.postId!)}
                type="button"
              >
                삭제
              </ActionButton>
            </PostActions>
          )}
        </PostItem>
      ))}
    </PostList>
  );
};

const PublishedList = ({
  onEdit,
  onView,
  onDeleteRequest,
  confirmDeleteId,
  onConfirmDelete,
  onCancelDelete,
}: {
  onEdit: (postId: number) => void;
  onView: (postId: number) => void;
  onDeleteRequest: (postId: number) => void;
  confirmDeleteId: number | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) => {
  const { data: posts } = useSuspenseQuery(blogQueries.posts());
  const publishedPosts = posts.filter(
    (post) => post.status === 'PUBLISHED' || post.status == null,
  );

  if (publishedPosts.length === 0) {
    return <EmptyState>발행된 글이 없습니다.</EmptyState>;
  }
  return (
    <PostList>
      {publishedPosts.map((post) => {
        if (post.postId == null) return null;
        const postId = post.postId;

        return (
          <PostItem key={postId}>
            <PostInfoButton
              aria-label={`${post.title || '(제목 없음)'} 읽기`}
              onClick={() => onView(postId)}
              type="button"
            >
              <PostTitleRow>
                <PostTitle>{post.title || '(제목 없음)'}</PostTitle>
                {post.visibility === 'PRIVATE' && (
                  <VisibilityBadge>비공개</VisibilityBadge>
                )}
              </PostTitleRow>
              <PostMeta>
                {formatPostMeta(post.publishedAt, post.updatedAt)}
              </PostMeta>
            </PostInfoButton>
            {post.isAuthor ? (
              confirmDeleteId === postId ? (
                <ConfirmActions>
                  <ConfirmText>정말 삭제할까요?</ConfirmText>
                  <ActionButton $danger onClick={onConfirmDelete} type="button">
                    확인
                  </ActionButton>
                  <ActionButton onClick={onCancelDelete} type="button">
                    취소
                  </ActionButton>
                </ConfirmActions>
              ) : (
                <PostActions>
                  <ActionButton onClick={() => onEdit(postId)} type="button">
                    수정
                  </ActionButton>
                  <ActionButton
                    $danger
                    onClick={() => onDeleteRequest(postId)}
                    type="button"
                  >
                    삭제
                  </ActionButton>
                </PostActions>
              )
            ) : null}
          </PostItem>
        );
      })}
    </PostList>
  );
};

export const BlogList = () => {
  const { tab: activeTab } = Route.useSearch();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  const createDraft = useCreateDraft();
  const deleteDraft = useDeleteDraft();

  const handleTabChange = (nextTab: Tab) => {
    if (nextTab === activeTab) return;
    navigate({
      to: '/blog',
      search: { tab: nextTab },
      replace: false,
    });
  };

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const result = await createDraft.mutateAsync();
      navigate({
        to: '/blog/$postId',
        params: { postId: String(result.postId) },
        search: { mode: 'edit', tab: activeTab },
      });
    } catch (err) {
      console.error('글 생성 실패:', err);
      setCreateError('새 글 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleEdit = (postId: number) => {
    navigate({
      to: '/blog/$postId',
      params: { postId: String(postId) },
      search: { mode: 'edit', tab: activeTab },
    });
  };

  const handleView = (postId: number) => {
    navigate({
      to: '/blog/$postId',
      params: { postId: String(postId) },
      search: { mode: 'view', tab: activeTab },
    });
  };

  const handleDeleteRequest = (postId: number) => {
    setDeleteError(null);
    setConfirmDeleteId(postId);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId === null) return;
    try {
      await deleteDraft.mutateAsync(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('글 삭제 실패:', err);
      setDeleteError('삭제에 실패했습니다. 다시 시도해주세요.');
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const createButton = (
    <CreateButton
      onClick={handleCreate}
      disabled={createDraft.isPending}
      type="button"
    >
      {createDraft.isPending ? '생성 중…' : '새 글 작성'}
    </CreateButton>
  );

  return (
    <Layout title="블로그" rightAction={createButton}>
      {createError && <InlineError>{createError}</InlineError>}
      {deleteError && <InlineError>{deleteError}</InlineError>}

      <Tabs>
        <TabButton
          $isActive={activeTab === 'drafts'}
          onClick={() => handleTabChange('drafts')}
        >
          임시저장
        </TabButton>
        <TabButton
          $isActive={activeTab === 'published'}
          onClick={() => handleTabChange('published')}
        >
          발행됨
        </TabButton>
      </Tabs>

      <ErrorBoundary
        fallback={<ErrorState>데이터를 불러오지 못했습니다.</ErrorState>}
      >
        <Suspense fallback={<LoadingState>불러오는 중…</LoadingState>}>
          {activeTab === 'drafts' ? (
            <DraftList
              onEdit={handleEdit}
              onDeleteRequest={handleDeleteRequest}
              confirmDeleteId={confirmDeleteId}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={handleCancelDelete}
            />
          ) : (
            <PublishedList
              onEdit={handleEdit}
              onView={handleView}
              onDeleteRequest={handleDeleteRequest}
              confirmDeleteId={confirmDeleteId}
              onConfirmDelete={handleConfirmDelete}
              onCancelDelete={handleCancelDelete}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const CreateButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const InlineError = styled.p`
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: #fef2f2;
  color: #dc2626;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Tabs = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  margin-bottom: -1px;
  padding: 10px 20px;
  border: none;
  border-bottom: 2px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : 'transparent'};

  background: none;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.gray600};
  font-weight: ${({ theme, $isActive }) =>
    $isActive ? theme.fontWeight.semibold : theme.fontWeight.normal};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s;
`;

const PostList = styled.ul`
  display: flex;
  gap: 8px;
  flex-direction: column;

  list-style: none;
`;

const PostItem = styled.li`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: white;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const PostInfoButton = styled.button`
  padding: 0;
  border: none;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;

  background: none;
  text-align: left;

  cursor: pointer;
`;

const PostTitleRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PostTitle = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const VisibilityBadge = styled.span`
  padding: 2px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PostMeta = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PostActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ConfirmText = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 4px 12px;
  border: 1px solid
    ${({ theme, $danger }) => ($danger ? '#dc2626' : theme.colors.gray300)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: white;
  color: ${({ $danger }) => ($danger ? '#dc2626' : 'inherit')};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const EmptyState = styled.p`
  padding: 48px;

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const LoadingState = styled.p`
  padding: 48px;

  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
`;

const ErrorState = styled.p`
  padding: 48px;

  color: #dc2626;
  text-align: center;
`;
