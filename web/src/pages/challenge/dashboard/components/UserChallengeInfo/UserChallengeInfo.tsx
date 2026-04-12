import styled from '@emotion/styled';
import UserChallengeOverview from './UserChallengeOverview';
import UserChallengeSummaryCard from './UserChallengeSummaryCard';
import UserDailyCheckList from './UserDailyCheckList';
import { useDevice } from '@/hooks/useDevice';
import type {
  GetChallengeInfoResponse,
  GetMemberChallengeProgressResponse,
} from '@/apis/challenge/challenge.api';

interface UserChallengeInfoProps {
  challengeInfo: GetChallengeInfoResponse;
  memberChallengeProgressInfo: GetMemberChallengeProgressResponse;
}

const UserChallengeInfo = ({
  challengeInfo,
  memberChallengeProgressInfo,
}: UserChallengeInfoProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const completionRate =
    (memberChallengeProgressInfo.completedDays / challengeInfo.totalDays) * 100;

  return (
    <Container isMobile={isMobile}>
      <OverviewArea>
        {challengeInfo && (
          <UserChallengeOverview
            challengeInfo={challengeInfo}
            memberChallengeProgressInfo={memberChallengeProgressInfo}
          />
        )}
      </OverviewArea>
      {isMobile && (
        <SummaryArea>
          <UserChallengeSummaryCard
            memberChallengeProgressInfo={memberChallengeProgressInfo}
            completionRate={completionRate}
          />
        </SummaryArea>
      )}
      <ChecklistArea isMobile={isMobile}>
        <UserDailyCheckList
          todayTodos={memberChallengeProgressInfo.todayTodos}
        />
      </ChecklistArea>
    </Container>
  );
};

export default UserChallengeInfo;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;
  padding: 0.625rem;

  display: flex;
  gap: 1.5rem;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'stretch' : 'flex-end')};
`;

const ChecklistArea = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '17.5rem')};
  flex-shrink: 0;
`;

const OverviewArea = styled.div`
  min-width: 0;
  flex: 1;
`;

const SummaryArea = styled.div`
  width: 100%;
`;
