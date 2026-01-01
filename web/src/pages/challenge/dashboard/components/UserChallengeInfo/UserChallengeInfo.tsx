import styled from '@emotion/styled';
import UserChallengeOverview from './UserChallengeOverview';
import UserDailyCheckList from './UserDailyCheckList';
import { useDevice } from '@/hooks/useDevice';
import type {
  ChallengeInfoResponse,
  MemberChallengeProgressResponse,
} from '@/apis/challenge/challenge.api';

interface UserChallengeInfoProps {
  challengeInfo: ChallengeInfoResponse;
  memberChallengeProgressInfo: MemberChallengeProgressResponse;
}

const UserChallengeInfo = ({
  challengeInfo,
  memberChallengeProgressInfo,
}: UserChallengeInfoProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

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
  padding: 10px;

  display: flex;
  gap: 24px;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'stretch' : 'flex-end')};
`;

const ChecklistArea = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '280px')};
  flex-shrink: 0;
`;

const OverviewArea = styled.div`
  min-width: 0;
  flex: 1;
`;
