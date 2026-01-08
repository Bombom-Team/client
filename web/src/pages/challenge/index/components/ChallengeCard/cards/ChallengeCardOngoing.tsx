import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { getDday } from '../../../utils/date';
import CardContainer from '../CardContainer';
import { Applicant, CardDetailButton, DDay, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Flex from '@/components/Flex';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardOngoing = (props: ChallengeCardProps) => {
  const navigate = useNavigate();

  const { detail, id, participantCount, generation, startDate, title } = props;

  const dday = getDday(startDate);

  const moveToDetail = () => {
    trackEvent({
      category: 'Challenge',
      action: 'ONGOING 카드 클릭',
      label: title,
    });

    navigate({
      to: '/challenge/$challengeId',
      params: { challengeId: String(id) },
    });
  };

  return (
    <CardContainer onClick={moveToDetail}>
      <CardHeader>
        <Flex direction="column" gap={8}>
          <Title>{title}</Title>
          <Tag>{generation}기</Tag>
        </Flex>

        <Flex align="flex-end" gap={12}>
          {participantCount > 0 && (
            <Applicant>신청자 {participantCount}명</Applicant>
          )}
          <DDay>D{dday}</DDay>
        </Flex>
      </CardHeader>

      <CardFooter>
        <ChallengeProgress>{detail?.progress}% 달성 중</ChallengeProgress>
        <CardDetailButton>자세히 보기 →</CardDetailButton>
      </CardFooter>
    </CardContainer>
  );
};

export default ChallengeCardOngoing;

const ChallengeProgress = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;
