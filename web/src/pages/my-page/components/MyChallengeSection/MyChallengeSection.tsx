import styled from '@emotion/styled';
import { useSuspenseQueries } from '@tanstack/react-query';
import ChallengeEmptyState from './ChallengeEmptyState';
import ChallengeStatsHeader from './ChallengeStatsHeader';
import CompletedChallengeCard from './CompletedChallengeCard';
import OngoingChallengeCard from './OngoingChallengeCard';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const MyChallengeSection = () => {
  const device = useDevice();
  const [summaryResult, ongoingResult, completedResult] = useSuspenseQueries({
    queries: [
      queries.myChallengeSummary(),
      queries.myOngoingChallenges(),
      queries.myCompletedChallenges(),
    ],
  });

  const summary = summaryResult.data;
  const ongoing = ongoingResult.data?.challenges ?? [];
  const completed = completedResult.data?.content ?? [];

  return (
    <Container>
      <Header>
        <PageTitle>나의 챌린지</PageTitle>
        <PageDesc>참여한 챌린지와 상위 기록을 한눈에 확인해보세요.</PageDesc>
      </Header>

      <ChallengeStatsHeader summary={summary} />

      <Section>
        <SectionTitle>참여 중인 챌린지</SectionTitle>
        {ongoing.length === 0 ? (
          <ChallengeEmptyState
            emoji="🎉"
            title="새로운 챌린지에 도전해보세요!"
            description="챌린지로 읽기 습관을 더 즐겁게 만들어보세요."
          />
        ) : (
          <CardList>
            {ongoing.map((challenge) => (
              <OngoingChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
              />
            ))}
          </CardList>
        )}
      </Section>

      <Section>
        <SectionTitle>완료한 챌린지</SectionTitle>
        {completed.length === 0 ? (
          <ChallengeEmptyState
            emoji="🏆"
            title="아직 완료한 챌린지가 없어요"
            description="챌린지를 완료하면 이곳에 기록이 쌓여요."
            showGoToChallengeButton={false}
          />
        ) : (
          <CompletedGrid device={device}>
            {completed.map((challenge) => (
              <CompletedChallengeCard
                key={challenge.challengeId}
                challenge={challenge}
              />
            ))}
          </CompletedGrid>
        )}
      </Section>
    </Container>
  );
};

export default MyChallengeSection;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const PageTitle = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t9Bold};
`;

const PageDesc = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const Section = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const CardList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CompletedGrid = styled.div<{ device: Device }>`
  display: grid;
  gap: 12px;

  grid-template-columns: ${({ device }) =>
    device === 'pc' ? 'repeat(2, 1fr)' : '1fr'};
`;
