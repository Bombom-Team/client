import styled from '@emotion/styled';
import CardContainer from '../CardContainer';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardFailed = (props: ChallengeCardProps) => {
  const { participantCount, generation, startDate, title } = props;

  return (
    <CardContainer disabled>
      <CardHeader
        title={title}
        startDate={startDate}
        tag={`${generation}기`}
        applicantCount={participantCount}
        isEliminated={true}
      />

      <CardFooter>
        <EliminatedDescription>
          참여율 80% 미만으로 탈락 처리되었습니다
        </EliminatedDescription>
      </CardFooter>
    </CardContainer>
  );
};

export default ChallengeCardFailed;

const EliminatedDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
