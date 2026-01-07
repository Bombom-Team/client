import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import CardContainer from '../CardContainer';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardOngoing = (props: ChallengeCardProps) => {
  const navigate = useNavigate();

  const { detail, id, participantCount, generation, startDate, title } = props;

  const isEliminated = detail?.isSuccess === false;

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
    <StyledCardContainer onClick={moveToDetail} isEliminated={isEliminated}>
      <CardHeader
        title={title}
        startDate={startDate}
        tag={`${generation}기`}
        applicantCount={participantCount}
        isEliminated={isEliminated}
      />

      <CardFooter isEliminated={isEliminated}>
        {isEliminated ? (
          <>
            {/* <EliminatedLabel>탈락</EliminatedLabel> */}
            <div></div>
            <EliminatedDescription>
              참여율 80% 미만으로 탈락 처리되었습니다
            </EliminatedDescription>
          </>
        ) : (
          <ChallengeProgress>{detail?.progress}% 달성 중</ChallengeProgress>
        )}
      </CardFooter>
    </StyledCardContainer>
  );
};

export default ChallengeCardOngoing;

const StyledCardContainer = styled(CardContainer)<{ isEliminated: boolean }>`
  background-color: ${({ theme, isEliminated }) =>
    isEliminated ? theme.colors.disabledBackground : theme.colors.white};

  &:hover {
    border-color: ${({ theme, isEliminated }) =>
      isEliminated ? theme.colors.stroke : undefined};
  }
`;

const ChallengeProgress = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const EliminatedDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
