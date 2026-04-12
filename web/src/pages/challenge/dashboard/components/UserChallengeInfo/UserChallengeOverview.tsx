import styled from '@emotion/styled';
import UserChallengeSummaryCard from './UserChallengeSummaryCard';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type {
  GetChallengeInfoResponse,
  GetMemberChallengeProgressResponse,
} from '@/apis/challenge/challenge.api';

interface UserChallengeOverviewProps {
  challengeInfo: GetChallengeInfoResponse;
  memberChallengeProgressInfo: GetMemberChallengeProgressResponse;
}

const UserChallengeOverview = ({
  challengeInfo,
  memberChallengeProgressInfo,
}: UserChallengeOverviewProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { name, generation, startDate, endDate, totalDays } = challengeInfo;
  const { completedDays } = memberChallengeProgressInfo;

  const completionRate = (completedDays / totalDays) * 100;

  return (
    <Container isMobile={isMobile}>
      <ChallengeHeader isMobile={isMobile}>
        <ChallengeTitle isMobile={isMobile}>
          {name} {generation}
        </ChallengeTitle>
        <ChallengePeriod isMobile={isMobile}>
          {formatDate(new Date(startDate)).slice(2)} ~{' '}
          {formatDate(new Date(endDate)).slice(2)}
        </ChallengePeriod>
      </ChallengeHeader>
      {!isMobile && (
        <SummaryWrapper>
          <UserChallengeSummaryCard
            memberChallengeProgressInfo={memberChallengeProgressInfo}
            completionRate={completionRate}
            showNickname={true}
          />
        </SummaryWrapper>
      )}
    </Container>
  );
};

export default UserChallengeOverview;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1rem' : '2.5rem')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'row' : 'column')};
`;

const ChallengeHeader = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 0.375rem;
  flex-direction: column;
`;

const ChallengeTitle = styled.span<{ isMobile: boolean }>`
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const ChallengePeriod = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.disabledText};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.heading6};
`;

const SummaryWrapper = styled.div`
  flex: 1;
`;
