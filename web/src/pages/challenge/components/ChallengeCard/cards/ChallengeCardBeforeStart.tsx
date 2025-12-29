import styled from '@emotion/styled';
import CardContainer from '../CardContainer';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Button from '@/components/Button/Button';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../../ChallengeCard';

const ChallengeCardBeforeStart = (props: ChallengeCardProps) => {
  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: '카드 클릭',
      label: props.title,
    });

    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <CardHeader {...props} />

      <CardFooter>
        {props.detail.isJoined ? (
          <ApplyButton>신청취소</ApplyButton>
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
