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
      <ChallengeHeader>
        <ChallengeTitle>
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
  gap: ${({ isMobile }) => (isMobile ? '16px' : '40px')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'row' : 'column')};
`;

const ChallengeHeader = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const ChallengeTitle = styled.span`
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const ChallengePeriod = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.disabledText};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t5Regular : theme.fonts.t6Bold};
`;

const SummaryWrapper = styled.div`
  flex: 1;
`;
