import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';

type TodoType = 'READ' | 'COMMENT';
type TodoStatus = 'COMPLETE' | 'INCOMPLETE';

interface DailyTodo {
  todoType: TodoType;
  status: TodoStatus;
}
interface UserDailyCheckListProps {
  todayTodos: DailyTodo[];
}

const todoLabels: Record<TodoType, string> = {
  READ: '뉴스레터를 읽었나요?',
  COMMENT: '오늘의 코멘트를 작성했나요?',
};

const UserDailyCheckList = ({ todayTodos }: UserDailyCheckListProps) => {
  const totalCount = todayTodos.length;
  const completedCount = todayTodos.filter(
    (todo) => todo.status === 'COMPLETE',
  ).length;

  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <Header>
        <Title>오늘의 체크 리스트</Title>
        <CountBadge>
          {completedCount}/{totalCount}
        </CountBadge>
      </Header>
      <List>
        {todayTodos.map((todo) => (
          <ListItem key={todo.todoType}>
            <StatusBox status={todo.status}>
              {todo.status === 'COMPLETE' ? '✓' : ''}
            </StatusBox>
            <TodoText>{todoLabels[todo.todoType]}</TodoText>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserDailyCheckList;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;
  padding: 18px 20px;
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 16px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const CountBadge = styled.div`
  padding: 4px 10px;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.caption};
  font-weight: 600;
`;

const List = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StatusBox = styled.div<{ status: TodoStatus }>`
  width: 18px;
  height: 18px;
  border: 1px solid
    ${({ theme, status: $status }) =>
      $status === 'COMPLETE' ? theme.colors.success : theme.colors.stroke};
  border-radius: 4px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme, status: $status }) =>
    $status === 'COMPLETE' ? theme.colors.success : theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 12px;
  line-height: 1;
`;

const TodoText = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
`;
