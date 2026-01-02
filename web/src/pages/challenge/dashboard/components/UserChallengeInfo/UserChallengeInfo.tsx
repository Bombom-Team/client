import styled from '@emotion/styled';
import UserChallengeOverview from './UserChallengeOverview';
import UserDailyCheckList from './UserDailyCheckList';
import { useDevice } from '@/hooks/useDevice';

type TodoType = 'READ' | 'COMMENT';
type TodoStatus = 'COMPLETE' | 'INCOMPLETE';

interface DailyTodo {
  todoType: TodoType;
  status: TodoStatus;
}

// API 응답으로 변경 예정

const mockData = {
  name: '챌린지명',
  generation: '1기',
  startDate: '2026-01-05',
  endDate: '2026-02-05',
  totalDays: 24,
  requiredDates: 19,
};

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

const UserChallengeInfo = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <OverviewArea>
        <UserChallengeOverview
          challengeData={mockData}
          userProcessData={userProcessMockData}
        />
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
