import styled from '@emotion/styled';
import PostContent from './PostContent';
import PostMetadata from './PostMetadata';
import { PostDetail } from '@/apis/blog/blog.api';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

interface PostDetailProps {
  post: PostDetail;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const device = useDevice();

  return (
    <>
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
    </>
  );
};

export default PostDetail;

const Title = styled.h1<{ device: Device }>`
  margin-bottom: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
`;

export const ContentWrapper = styled.div<{ device: Device }>`
  padding-bottom: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};
`;

export const ContentLayoutWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '920px' : '100%')};
  margin: 0 auto;
  padding: ${({ device }) => (device === 'mobile' ? '0' : '0 24px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '40px' : '0')};
  align-items: flex-start;
`;

export const ActionRail = styled.div`
  width: 56px;
  flex-shrink: 0;
`;

export const ThumbnailBox = styled.div<{ device: Device }>`
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
