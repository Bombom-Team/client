import styled from '@emotion/styled';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { useDevice } from '@/hooks/useDevice';
import useScrollProgress from '@/hooks/useScrollProgress';
import { BLOG_POST_DETAILS } from '@/mocks/datas/blogPosts';
import FloatingPostPanel from '@/pages/blog/components/FloatingPostPanel';
import PostContent from '@/pages/blog/components/PostContent';
import PostMetadata from '@/pages/blog/components/PostMetadata';
import { createBlogPostingSchema } from '@/pages/blog/utils/seo';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/blog/post/$postId/$title')({
  loader: ({ params }) => {
    const postId = params.postId;
    const post = BLOG_POST_DETAILS[postId];
    if (!post) {
      throw new Error('해당 글을 찾을 수 없습니다.');
    }

    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;

    if (!post) return { meta: [] };

    const schemaJson = createBlogPostingSchema(post);
    return {
      meta: [
        { title: post.title },
        { property: 'og:title', content: post.title },
        { property: 'og:image', content: post.thumbnailImageUrl || '' },
        { property: 'og:type', content: 'article' },
        { name: 'robots', content: 'index, follow' },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: schemaJson,
        },
      ],
    };
  },
  component: PostDetailPage,
});

function PostDetailPage() {
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

            <Title device={device}>{post.title}</Title>

            <PostMetadata
              categoryName={post.categoryName}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              hashTags={post.hashTags}
            />

            {post.thumbnailImageUrl && (
              <ThumbnailBox device={device}>
                <ThumbnailImage src={post.thumbnailImageUrl} alt={post.title} />
              </ThumbnailBox>
            )}

            <PostContent content={post.content} />
          </Article>
        </ContentLayoutWrapper>
      </ContentWrapper>
    </>
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
  padding: ${({ device }) => (device === 'mobile' ? '0 20px' : '0 24px')};

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
`;

const GoToListButton = styled(Button)<{ device: Device }>`
  margin-bottom: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};

  transition: color 0.2s ease;

  &:hover {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.h1<{ device: Device }>`
  margin-bottom: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
`;

const ThumbnailBox = styled.div<{ device: Device }>`
  overflow: hidden;
  margin: ${({ device }) => (device === 'mobile' ? '24px 0' : '32px 0')};
  border-radius: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};

  background-color: ${({ theme }) => theme.colors.dividers};

  aspect-ratio: 16 / 9;
`;

const ThumbnailImage = styled(ImageWithFallback)`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;
