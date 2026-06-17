import styled from '@emotion/styled';
import type { ReviewerWithStats } from '@/types/reviewer';
import { useToggleVacationMutation } from '@/hooks/useToggleVacationMutation';

type Props = {
  reviewers: ReviewerWithStats[];
};

export const ReviewersTableBody = ({ reviewers }: Props) => {
  const toggleMutation = useToggleVacationMutation();

  return (
    <Tbody>
      {reviewers.map((reviewer) => (
        <Tr key={reviewer.id}>
          <Td>{reviewer.display_name}</Td>
          <Td>
            <a
              href={`https://github.com/${reviewer.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{reviewer.github_username}
            </a>
          </Td>
          <Td>{reviewer.monthlyCount}</Td>
          <Td>{reviewer.weeklyCount}</Td>
          <Td>{reviewer.openAssignments.length}</Td>
          <Td>
            <VacationBadge $isOnVacation={reviewer.is_on_vacation}>
              {reviewer.is_on_vacation ? '휴가 중' : '활성'}
            </VacationBadge>
          </Td>
          <Td>
            <ToggleButton
              onClick={() =>
                toggleMutation.mutate({
                  reviewerId: reviewer.id,
                  currentValue: reviewer.is_on_vacation,
                })
              }
              disabled={toggleMutation.isPending}
            >
              {reviewer.is_on_vacation ? '복귀' : '휴가'}
            </ToggleButton>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export const ReviewersTableBodyLoading = () => (
  <tbody>
    {Array.from({ length: 3 }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 7 }).map((_, j) => (
          <td key={j}>—</td>
        ))}
      </tr>
    ))}
  </tbody>
);

export const ReviewersTableBodyError = ({ message }: { message: string }) => (
  <tbody>
    <tr>
      <td colSpan={7} style={{ textAlign: 'center', color: '#ef4444', padding: '16px' }}>
        {message}
      </td>
    </tr>
  </tbody>
);

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
`;

const VacationBadge = styled.span<{ $isOnVacation: boolean }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ $isOnVacation }) => ($isOnVacation ? '#fee2e2' : '#d1fae5')};
  color: ${({ $isOnVacation }) => ($isOnVacation ? '#991b1b' : '#065f46')};
`;

const ToggleButton = styled.button`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
