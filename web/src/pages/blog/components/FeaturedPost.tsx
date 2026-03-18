import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Post } from '../types/post';
import type { Device } from '@/hooks/useDevice';

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const device = useDevice();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
  };

  return (
    <Container
      onKeyDown={handleKeyDown}
      role="article"
      tabIndex={0}
      aria-label={`추천 블로그 포스트: ${post.title}`}
      device={device}
    >
      <Thumbnail device={device}>
        {post.thumbnailImageUrl ? (
          <ThumbnailImage src={post.thumbnailImageUrl} alt={post.title} />
        ) : (
          <NoThumbnailPlaceholder>이미지 없음</NoThumbnailPlaceholder>
        )}
      </Thumbnail>

      <Content device={device}>
        <Text
          color="textSecondary"
          font={device === 'mobile' ? 'body1' : 'bodyLarge'}
        >
          이 주의 콘텐츠
        </Text>
        <Flex gap={device === 'mobile' ? 20 : 24} direction="column">
          <Title device={device}>{post.title}</Title>
          {post.description && (
            <Description device={device}>{post.description}</Description>
          )}

          <Text
            color="textTertiary"
            font={device === 'mobile' ? 'body2' : 'body1'}
          >
            추천 콘텐츠
          </Text>
        </Flex>
      </Content>
    </Container>
  );
};

export default FeaturedPost;

const Container = styled.a<{ device: Device }>`
  border-radius: 16px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '40px')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};

  cursor: pointer;

  &:hover img {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Thumbnail = styled.div<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: ${({ device }) => (device === 'mobile' ? '100%' : '50%')};
  height: ${({ device }) => (device === 'mobile' ? '240px' : '332px')};
  border-radius: 16px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.dividers};

  img {
    transition: transform 0.3s ease;
  }
`;

const ThumbnailImage = styled(ImageWithFallback)`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const NoThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.dividers};
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const Content = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
  line-height: 1.4;
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;
