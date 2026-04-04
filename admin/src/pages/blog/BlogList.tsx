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

type Tab = 'drafts' | 'published';

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
  const { data: posts } = useSuspenseQuery(blogQueries.posts());
  if (posts.length === 0) {
    return <EmptyState>발행된 글이 없습니다.</EmptyState>;
  }
  return (
    <PostList>
      {posts.map((post) => (
        <PostItem key={post.postId}>
          <PostInfo>
            <PostTitle>{post.title}</PostTitle>
            <PostMeta>
              {post.categoryName} ·{' '}
              {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
            </PostMeta>
          </PostInfo>
          {confirmDeleteId === post.postId ? (
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
              <ActionButton onClick={() => onEdit(post.postId)} type="button">
                수정
              </ActionButton>
              <ActionButton
                $danger
                onClick={() => onDeleteRequest(post.postId)}
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

export const BlogList = () => {
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();
  const createDraft = useCreateDraft();
  const deleteDraft = useDeleteDraft();

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const result = await createDraft.mutateAsync();
      navigate({
        to: '/blog/$postId',
        params: { postId: String(result.postId) },
      });
    } catch (err) {
      console.error('글 생성 실패:', err);
      setCreateError('새 글 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleEdit = (postId: number) => {
    navigate({ to: '/blog/$postId', params: { postId: String(postId) } });
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
          onClick={() => setActiveTab('drafts')}
        >
          임시저장
        </TabButton>
        <TabButton
          $isActive={activeTab === 'published'}
          onClick={() => setActiveTab('published')}
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

const PostInfo = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const PostTitle = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
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
