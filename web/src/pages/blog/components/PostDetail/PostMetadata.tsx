import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type { Device } from '@/hooks/useDevice';
import CalendarIcon from '#/assets/svg/calendar.svg';
import ClockIcon from '#/assets/svg/clock.svg';

interface PostMetadataProps {
  categoryName: string;
  publishedAt: string;
  readingTime?: number;
  hashTags: string[];
}

const PostMetadata = ({
  categoryName,
  publishedAt,
  readingTime,
  hashTags,
}: PostMetadataProps) => {
  const device = useDevice();
  const formattedDate = formatDate(new Date(publishedAt));

  return (
    <Flex direction="column" gap={16}>
      <MetaWrapper gap={device === 'mobile' ? 8 : 16} align="center">
        <CategoryBadge device={device}>{categoryName}</CategoryBadge>
        <Text
          aria-hidden="true"
          color="textTertiary"
          font={device === 'mobile' ? 't3Regular' : 't7Regular'}
        >
          •
        </Text>
        <MetaInfo>
          <CalendarIcon
            aria-hidden="true"
            width={device === 'mobile' ? 12 : 20}
            height={device === 'mobile' ? 12 : 20}
            color={theme.colors.textTertiary}
          />
          <PublishedTime
            as="time"
            dateTime={publishedAt}
            color="textTertiary"
            font={device === 'mobile' ? 't3Regular' : 't7Regular'}
          >
            {formattedDate}
          </PublishedTime>
        </MetaInfo>
        {readingTime && (
          <>
            <Text
              aria-hidden="true"
              color="textTertiary"
              font={device === 'mobile' ? 't3Regular' : 't7Regular'}
            >
              •
            </Text>
            <MetaInfo>
              <ClockIcon
                aria-hidden="true"
                width={device === 'mobile' ? 12 : 20}
                height={device === 'mobile' ? 12 : 20}
                color={theme.colors.textTertiary}
              />
              <Text
                color="textTertiary"
                font={device === 'mobile' ? 't3Regular' : 't7Regular'}
              >
                {readingTime}분
              </Text>
            </MetaInfo>
          </>
        )}
      </MetaWrapper>
      {hashTags.length > 0 && (
        <Flex gap={8} wrap="wrap">
          {hashTags.map((tag) => (
            <Text
              key={tag}
              color="primary"
              font={device === 'mobile' ? 't3Regular' : 't7Regular'}
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
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t5Regular : theme.fonts.t6Regular};
`;

const MetaWrapper = styled(Flex)`
  text-align: center;
`;

const PublishedTime = styled(Text)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  vertical-align: middle;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  svg {
    margin-bottom: 2px;
  }
`;
