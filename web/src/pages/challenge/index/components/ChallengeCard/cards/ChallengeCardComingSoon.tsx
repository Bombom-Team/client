import { useNavigate } from '@tanstack/react-router';
import CardContainer from '../CardContainer';
import { CardDetailButton, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { getDatesDiff } from '@/utils/date';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardComingSoon = (props: ChallengeCardProps) => {
  const { generation, title, startDate, endDate, id } = props;
  const navigate = useNavigate();

  const isWeeklyChallenge =
    getDatesDiff(new Date(startDate), new Date(endDate)) <= 7;

  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: 'COMING_SOON 카드 클릭',
      label: title,
    });

    if (isWeeklyChallenge) {
      openExternalLink(
        'https://maroon-geranium-880.notion.site/1-2fb03dcf20568089a20ad05cd3de78fe?pvs=74',
      );
    } else {
      navigate({
        to: '/challenge/$challengeId/landing',
        params: { challengeId: id.toString() },
      });
    }
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <CardHeader>
        <Flex direction="column" gap={8}>
          <Title>{title}</Title>
          <Tag>{generation}기</Tag>
        </Flex>
      </CardHeader>

      <CardFooter>
        <Text font="heading6">Coming Soon</Text>
        <CardDetailButton>자세히 보기 →</CardDetailButton>
      </CardFooter>
    </CardContainer>
  );
};

export default ChallengeCardComingSoon;
