import CardContainer from '../CardContainer';
import { Title, Tag, Applicant, DDay, CardDetailButton } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardComingSoon = (props: ChallengeCardProps) => {
  const { participantCount, generation, startDate, title } = props;

  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: 'COMING_SOON 카드 클릭',
      label: title,
    });

    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <CardHeader>
        <Flex direction="column" gap={8}>
          <Title>{title}</Title>
          <Tag>{generation}기</Tag>
        </Flex>

        <Flex align="flex-end" gap={12}>
          {participantCount > 0 && (
            <Applicant>신청자 {participantCount}명</Applicant>
          )}
          <DDay startDate={startDate} />
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
