import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import ChallengeCard from '@/pages/challenge/index/components/ChallengeCard/ChallengeCard';

const ChallengeSection = () => {
  const { data: challenges } = useQuery(queries.challengeSummaries());

  return (
    <Container>
      {challenges?.slice(0, 2).map((challenge) => (
        <ChallengeCard key={challenge.id} {...challenge} />
      ))}
    </Container>
  );
};

export default ChallengeSection;

const Container = styled.section`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  > * {
    flex: 1;
  }
`;
