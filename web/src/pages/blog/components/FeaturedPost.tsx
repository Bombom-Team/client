import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { createSlug } from '../utils/url';
import Flex from '@/components/Flex';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { PostListItem } from '@/pages/blog/types/post';

interface FeaturedPostProps {
  post: PostListItem;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const device = useDevice();
  const slug = createSlug(post.title);

  return (
    <Container
      to={`/blog/post/${post.postId}/${slug}`}
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

      <ContentWrapper device={device}>
        <Text
          as="p"
          color="textTertiary"
          font={device === 'mobile' ? 't6Regular' : 't7Regular'}
        >
          이 주의 콘텐츠
        </Text>
        <DescriptionBox>
          <Title device={device}>{post.title}</Title>
          {post.description && (
            <Description device={device}>{post.description}</Description>
          )}
        </DescriptionBox>
        {device === 'mobile' ? (
          <Flex align="center">
            <Text color="textSecondary" font="t6Regular">
              {post.categoryName}
            </Text>
          </Flex>
        ) : (
          <Text color="textTertiary" font="t6Regular">
            {post.categoryName}
          </Text>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default FeaturedPost;

export const Container = styled(Link)<{ device: Device }>`
  border-radius: 16px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '32px' : '40px')};
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

export const Thumbnail = styled.div<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: ${({ device }) => (device === 'mobile' ? '100%' : '50%')};
  height: ${({ device }) => (device === 'mobile' ? '240px' : '332px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '28px' : '16px')};

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
  font: ${({ theme }) => theme.fonts.t5Regular};
  font-weight: 600;
`;

export const ContentWrapper = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '16px')};
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

export const DescriptionBox = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t15Bold};
  line-height: ${({ device }) => (device === 'mobile' ? '1.18' : '1.4')};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t7Regular : theme.fonts.t10Bold};
  font-weight: 400;
  line-height: ${({ device }) => (device === 'mobile' ? '1.7' : 'inherit')};
`;
