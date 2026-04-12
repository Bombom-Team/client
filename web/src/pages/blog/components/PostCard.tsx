import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { createSlug } from '../utils/url';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { formatDateToKorean } from '@/utils/date';
import type { Device } from '@/hooks/useDevice';
import type { PostListItem } from '@/pages/blog/types/post';
import CalendarIcon from '#/assets/svg/calendar.svg';

interface PostCardProps {
  post: PostListItem;
}

const PostCard = ({ post }: PostCardProps) => {
  const device = useDevice();
  const slug = createSlug(post.title);

  return (
    <Container
      to={`/blog/post/${post.postId}/${slug}`}
      aria-label={`블로그 포스트: ${post.title}`}
    >
      <Thumbnail device={device}>
        {post.thumbnailImageUrl ? (
          <ThumbnailImage src={post.thumbnailImageUrl} alt={post.title} />
        ) : (
          <NoThumbnailPlaceholder>이미지 없음</NoThumbnailPlaceholder>
        )}
      </Thumbnail>

      <ContentWrapper>
        <Title device={device}>{post.title}</Title>
        {post.description && (
          <Description device={device}>{post.description}</Description>
        )}

        <MetaInfo>
          <CalendarIcon
            aria-hidden="true"
            width={device === 'mobile' ? 12 : 14}
            height={device === 'mobile' ? 12 : 14}
            color={theme.colors.textTertiary}
          />
          <Text
            color="textTertiary"
            font={device === 'mobile' ? 'body3' : 'body1'}
          >
            <time dateTime={post.publishedAt}>
              {formatDateToKorean(new Date(post.publishedAt))}
            </time>
          </Text>
          <Text
            aria-hidden="true"
            color="textTertiary"
            font={device === 'mobile' ? 'body3' : 'body1'}
          >
            |
          </Text>
          <Text
            color="textTertiary"
            font={device === 'mobile' ? 'body3' : 'body1'}
          >
            {post.categoryName}
          </Text>
        </MetaInfo>
      </ContentWrapper>
    </Container>
  );
};

export default PostCard;

export const Container = styled(Link)`
  border-radius: 16px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  color: inherit;

  cursor: pointer;
  text-decoration: none;

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

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  line-height: 1.4;
`;

const Description = styled.p<{ device: Device }>`
  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.bodyLarge};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;

export const ContentWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export const MetaInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  svg {
    margin-bottom: 1px;
  }
`;
