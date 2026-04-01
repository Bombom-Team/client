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
  onDelete,
}: {
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
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
          <PostActions>
            <ActionButton onClick={() => onEdit(draft.postId)} type="button">
              수정
            </ActionButton>
            <ActionButton
              $danger
              onClick={() => onDelete(draft.postId)}
              type="button"
            >
              삭제
            </ActionButton>
          </PostActions>
        </PostItem>
      ))}
    </PostList>
  );
};

const PublishedList = ({
  onEdit,
  onDelete,
}: {
  onEdit: (postId: number) => void;
  onDelete: (postId: number) => void;
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
          <PostActions>
            <ActionButton onClick={() => onEdit(post.postId)} type="button">
              수정
            </ActionButton>
            <ActionButton
              $danger
              onClick={() => onDelete(post.postId)}
              type="button"
            >
              삭제
            </ActionButton>
          </PostActions>
        </PostItem>
      ))}
    </PostList>
  );
};

export const BlogList = () => {
  const [activeTab, setActiveTab] = useState<Tab>('drafts');
  const navigate = useNavigate();
  const createDraft = useCreateDraft();
  const deleteDraft = useDeleteDraft();

  const handleCreate = async () => {
    const result = await createDraft.mutateAsync();
    navigate({
      to: '/blog/$postId',
      params: { postId: String(result.postId) },
    });
  };

  const handleEdit = (postId: number) => {
    navigate({ to: '/blog/$postId', params: { postId: String(postId) } });
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await deleteDraft.mutateAsync(postId);
  };

  const createButton = (
    <CreateButton
      onClick={handleCreate}
      disabled={createDraft.isPending}
      type="button"
    >
      {createDraft.isPending ? '생성 중...' : '새 글 작성'}
    </CreateButton>
  );

  return (
    <Layout title="블로그" rightAction={createButton}>
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
        <Suspense fallback={<LoadingState>불러오는 중...</LoadingState>}>
          {activeTab === 'drafts' ? (
            <DraftList onEdit={handleEdit} onDelete={handleDelete} />
          ) : (
            <PublishedList onEdit={handleEdit} onDelete={handleDelete} />
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
  transition: all 0.15s;
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

const ActionButton = styled.button<{ $danger?: boolean }>`
  padding: 4px 12px;
  border: 1px solid
    ${({ theme, $danger }) => ($danger ? 'red' : theme.colors.gray300)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: white;
  color: ${({ $danger }) => ($danger ? 'red' : 'inherit')};
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

  color: red;
  text-align: center;
`;
