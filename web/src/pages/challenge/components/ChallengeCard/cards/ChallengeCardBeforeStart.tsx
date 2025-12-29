import styled from '@emotion/styled';
import CardContainer from '../CardContainer';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Button from '@/components/Button/Button';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../../ChallengeCard';

const ChallengeCardBeforeStart = (props: ChallengeCardProps) => {
  const { participantCount, startDate, title } = props;
  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: '카드 클릭',
      label: title,
    });

    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <CardHeader
        title={title}
        startDate={startDate}
        applicantCount={participantCount}
      />

      <CardFooter>
        {props.detail.isJoined ? (
          <ApplyButton variant="outlined">신청취소</ApplyButton>
        ) : (
          <ApplyButton>신청하기</ApplyButton>
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default ChallengeCardBeforeStart;

const ApplyButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;
