import styled from '@emotion/styled';
import Chip from '@/components/Chip/Chip';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type { Device } from '@/hooks/useDevice';
import ClockIcon from '#/assets/svg/clock.svg';

interface ArticleHeaderProps {
  title: string;
  newsletterCategory: string;
  newsletterName: string;
  arrivedDateTime: Date;
  expectedReadTime: number;
}

const ArticleHeader = ({
  title,
  newsletterCategory,
  newsletterName,
  arrivedDateTime,
  expectedReadTime,
}: ArticleHeaderProps) => {
  const device = useDevice();

  return (
    <Container>
      <TitleRow>
        <Title device={device}>{title}</Title>
      </TitleRow>
      <MetaInfoRow>
        <Chip text={newsletterCategory} />
        <MetaInfoText>from {newsletterName}</MetaInfoText>
        <MetaInfoText>{formatDate(arrivedDateTime)}</MetaInfoText>
        <ReadTimeBox>
          <ClockIcon width={16} height={16} />
          <MetaInfoText>{expectedReadTime}분</MetaInfoText>
        </ReadTimeBox>
      </MetaInfoRow>
    </Container>
  );
};

export default ArticleHeader;

const Container = styled.div`
  padding: 1.25rem 0;

  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const TitleRow = styled.div`
  width: 100%;

  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const Title = styled.h2<{ device: Device }>`
  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading3};
`;

const MetaInfoRow = styled.div`
  width: 100%;

  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MetaInfoText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const ReadTimeBox = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;
