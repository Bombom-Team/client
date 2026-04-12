import styled from '@emotion/styled';
import PostContent from './PostContent';
import PostMetadata from './PostMetadata';
import { getReadingTimeMinutes } from '../../utils/tiptap';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { PostDetail } from '@/pages/blog/types/post';

interface PostDetailProps {
  post: PostDetail;
}

const PostDetail = ({ post }: PostDetailProps) => {
  const device = useDevice();
  const readingTime = getReadingTimeMinutes(post.content);

  return (
    <>
      <Title device={device}>{post.title}</Title>

      <PostMetadata
        categoryName={post.categoryName}
        publishedAt={post.publishedAt}
        readingTime={readingTime}
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
  margin-bottom: ${({ device }) => (device === 'mobile' ? '1rem' : '1.25rem')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
`;

export const ThumbnailBox = styled.div<{ device: Device }>`
  overflow: hidden;
  margin: ${({ device }) => (device === 'mobile' ? '1.5rem 0' : '2rem 0')};
  border-radius: ${({ device }) => (device === 'mobile' ? '1rem' : '1.25rem')};

  background-color: ${({ theme }) => theme.colors.dividers};

  aspect-ratio: 16 / 9;
`;

const ThumbnailImage = styled(ImageWithFallback)`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;
