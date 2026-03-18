import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { formatDateToKorean } from '@/utils/date';
import type { Post } from '../types/post';
import type { Device } from '@/hooks/useDevice';
import CalendarIcon from '#/assets/svg/calendar.svg';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
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
      aria-label={`블로그 포스트: ${post.title}`}
    >
      <Thumbnail device={device}>
        {post.thumbnailImageUrl ? (
          <ThumbnailImage src={post.thumbnailImageUrl} alt={post.title} />
        ) : (
          <NoThumbnailPlaceholder>이미지 없음</NoThumbnailPlaceholder>
        )}
      </Thumbnail>

      <Content>
        <Flex gap={8} align="center">
          <CalendarIcon width={14} height={14} />
          <Text color="textTertiary">
            <time dateTime={post.publishedAt}>
              {formatDateToKorean(new Date(post.publishedAt))}
            </time>
          </Text>
          <Text color="textTertiary">|</Text>
          <Text color="textTertiary">{post.categoryName}</Text>
        </Flex>

        <Title device={device}>{post.title}</Title>
        {post.description && <Description>{post.description}</Description>}
      </Content>
    </Container>
  );
};

export default PostCard;

const Container = styled.a`
  border-radius: 16px;

  display: flex;
  flex-direction: column;

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
  width: 100%;
  height: ${({ device }) => (device === 'mobile' ? '180px' : '216px')};
  border-radius: 16px;

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

const Content = styled.div`
  padding: 24px;

  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
  line-height: 1.4;
`;

const Description = styled.p`
  overflow: hidden;
  margin: 0;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;
