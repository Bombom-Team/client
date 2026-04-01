import styled from '@emotion/styled';
import CardContainer from '../CardContainer';
import { Applicant, DDay, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Flex from '@/components/Flex';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardFailed = (props: ChallengeCardProps) => {
  const { participantCount, generation, startDate, title } = props;

  return (
    <CardContainer disabled>
      <CardHeader>
        <Flex gap={8} align="center">
          <Tag>{generation}기</Tag>
          {participantCount > 0 && <Applicant>{participantCount}명</Applicant>}
        </Flex>
        <DDay startDate={startDate} />
      </CardHeader>

      <Title color="disabledText">{title}</Title>

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
