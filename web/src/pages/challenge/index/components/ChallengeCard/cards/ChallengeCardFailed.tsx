import styled from '@emotion/styled';
import { getDday } from '../../../utils/date';
import CardContainer from '../CardContainer';
import { Applicant, DDay, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Flex from '@/components/Flex';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardFailed = (props: ChallengeCardProps) => {
  const { participantCount, generation, startDate, title } = props;

  const dday = getDday(startDate);

  return (
    <CardContainer disabled>
      <CardHeader>
        <Flex direction="column" gap={8}>
          <Title color="disabledText">{title}</Title>
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
