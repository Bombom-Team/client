import styled from '@emotion/styled';
import UserChallengeOverview from './UserChallengeOverview';
import UserDailyCheckList from './UserDailyCheckList';
import { useDevice } from '@/hooks/useDevice';
import type { ChallengeInfoResponse } from '@/apis/challenge/challenge.api';

type TodoType = 'READ' | 'COMMENT';
type TodoStatus = 'COMPLETE' | 'INCOMPLETE';

interface DailyTodo {
  todoType: TodoType;
  status: TodoStatus;
}

const todayTodos: DailyTodo[] = [
  {
    todoType: 'READ',
    status: 'COMPLETE',
  },
  {
    todoType: 'COMMENT',
    status: 'INCOMPLETE',
  },
];

// API 응답으로 변경 예장

const userProcessMockData = {
  nickname: '메이토',
  totalDays: 24,
  completedDays: 23,
  todayTodos,
};

interface UserChallengeInfoProps {
  challengeInfo: ChallengeInfoResponse;
}

const UserChallengeInfo = ({ challengeInfo }: UserChallengeInfoProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <OverviewArea>
        {challengeInfo && (
          <UserChallengeOverview
            challengeInfo={challengeInfo}
            userProcessData={userProcessMockData}
          />
        )}
      </OverviewArea>
      <ChecklistArea isMobile={isMobile}>
        <UserDailyCheckList todayTodos={userProcessMockData.todayTodos} />
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
