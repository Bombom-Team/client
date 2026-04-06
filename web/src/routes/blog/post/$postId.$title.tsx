import styled from '@emotion/styled';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Suspense } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { useDevice } from '@/hooks/useDevice';
import useScrollProgress from '@/hooks/useScrollProgress';
import FloatingPostPanel from '@/pages/blog/components/PostDetail/FloatingPostPanel';
import PostDetail from '@/pages/blog/components/PostDetail/PostDetail';
import PostDetailSkeleton from '@/pages/blog/components/PostDetail/PostDetailSkeleton';
import ShareButton from '@/pages/blog/components/PostDetail/ShareButton';
import { createBlogPostingSchema } from '@/pages/blog/utils/seo';
import { createSlug } from '@/pages/blog/utils/url';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog/post/$postId/$title')({
  loader: async ({ context, params }) => {
    const postId = Number(params.postId);
    const post = await context.queryClient.ensureQueryData(
      queries.blogPostDetail({
        postId,
      }),
    );

    return { post };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;

    if (!post) return { meta: [] };

    const description = post.content.slice(0, 50);
    const schemaJson = createBlogPostingSchema(
      post,
      params.postId,
      params.title,
    );

    return {
      meta: [
        { title: post.title },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: post.thumbnailImageUrl ?? '' },
        { property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: post.publishedAt },
        ...post.hashTags.map((tag) => ({
          property: 'article:tag',
          content: tag,
        })),
        {
          name: 'twitter:card',
          content: post.thumbnailImageUrl ? 'summary_large_image' : 'summary',
        },
        { name: 'twitter:title', content: post.title },
        { name: 'twitter:description', content: description },
        ...(post.thumbnailImageUrl
          ? [
              { name: 'twitter:image', content: post.thumbnailImageUrl },
              { name: 'twitter:image:alt', content: post.title },
            ]
          : []),
      ],
      links: [
        {
          rel: 'canonical',
          href: `https://www.bombom.news/blog/post/${params.postId}/${createSlug(post.title)}`,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: schemaJson,
        },
      ],
    };
  },
  pendingComponent: PostDetailSkeleton,
  component: PostDetailPage,
});

const PostDetailContent = () => {
  const { post } = Route.useLoaderData();
  const navigate = useRouter().navigate;
  const device = useDevice();
  const { progressPercentage } = useScrollProgress();

  const goToPostList = () => {
    navigate({ to: '/blog' });
  };

  return (
    <>
      <PostProgressBar
        rate={progressPercentage}
        transition={false}
        variant="rectangular"
        device={device}
      />
      <ContentWrapper device={device}>
        <ContentLayoutWrapper device={device}>
          {device === 'pc' && (
            <ActionRail>
              <FloatingPostPanel />
            </ActionRail>
          )}

          <Article device={device}>
            <GoToListButton
              variant="transparent"
              onClick={goToPostList}
              device={device}
            >
              ← 목록으로 돌아가기
            </GoToListButton>

            <PostDetail post={post} />

            {device !== 'pc' && (
              <ShareRow>
                <ShareButton />
              </ShareRow>
            )}
          </Article>
        </ContentLayoutWrapper>
      </ContentWrapper>
    </>
  );
};

function PostDetailPage() {
  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailContent />
    </Suspense>
  );
}

const ContentWrapper = styled.div<{ device: Device }>`
  padding-bottom: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};
`;

const PostProgressBar = styled(ProgressBar)<{ device: Device }>`
  position: sticky;
  top: ${({ device, theme }) =>
    device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile};
  z-index: ${({ theme }) => theme.zIndex.floating};
  width: 100vw;
  height: 4px;
  max-width: 100vw;
  margin-top: ${({ device }) => (device === 'mobile' ? '-32px' : '-48px')};
  margin-bottom: ${({ device }) => (device === 'mobile' ? '28px' : '44px')};
  margin-left: calc(50% - 50vw);
`;

const ContentLayoutWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '920px' : '100%')};
  margin: 0 auto;
  padding: ${({ device }) => (device === 'mobile' ? '0' : '0 24px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '40px' : '0')};
  align-items: flex-start;
`;

const ActionRail = styled.div`
  width: 56px;
  flex-shrink: 0;
`;

const Article = styled.article<{ device: Device }>`
  width: 100%;
  margin-top: ${({ device }) => (device === 'mobile' ? '0' : '60px')};
`;

const GoToListButton = styled(Button)<{ device: Device }>`
  margin-bottom: ${({ device }) => (device === 'mobile' ? '20px' : '40px')};
  padding: 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};

  transition: color 0.2s ease;

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ShareRow = styled.div`
  margin-top: 48px;

  display: flex;
  justify-content: flex-end;
`;
