import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { formatDateToKorean } from '@/utils/date';
import type { Device } from '@/hooks/useDevice';
import ClockIcon from '#/assets/svg/clock.svg';

interface PostMetadataProps {
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  hashTags: string[];
}

const PostMetadata = ({
  categoryName,
  publishedAt,
  readingTime,
  hashTags,
}: PostMetadataProps) => {
  const device = useDevice();
  const formattedDate = formatDateToKorean(new Date(publishedAt));

  return (
    <Flex direction="column" gap={16}>
      <Flex gap={device === 'mobile' ? 8 : 16} align="center">
        <CategoryBadge device={device}>{categoryName}</CategoryBadge>
        <Text
          aria-hidden="true"
          color="textTertiary"
          font={device === 'mobile' ? 'body3' : 'body1'}
        >
          •
        </Text>
        <Text
          color="textTertiary"
          font={device === 'mobile' ? 'body3' : 'body1'}
        >
          <time dateTime={publishedAt}>{formattedDate}</time>
        </Text>
        <Text
          aria-hidden="true"
          color="textTertiary"
          font={device === 'mobile' ? 'body3' : 'body1'}
        >
          •
        </Text>
        <Flex gap={4} align="center">
          <ClockIcon
            aria-hidden="true"
            width={device === 'mobile' ? 12 : 14}
            height={device === 'mobile' ? 12 : 14}
            color={theme.colors.textTertiary}
          />
          <Text
            color="textTertiary"
            font={device === 'mobile' ? 'body3' : 'body1'}
          >
            {readingTime}분
          </Text>
        </Flex>
      </Flex>
      {hashTags.length > 0 && (
        <Flex gap={8} wrap="wrap">
          {hashTags.map((tag) => (
            <Text
              key={tag}
              color="primary"
              font={device === 'mobile' ? 'body3' : 'body1'}
            >
              #{tag}
            </Text>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default PostMetadata;

const CategoryBadge = styled.span<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '4px 8px' : '4px 12px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body2};
`;
