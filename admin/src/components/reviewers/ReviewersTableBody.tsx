import styled from '@emotion/styled';
import { isOverdue } from '@/apis/reviewers/reviewers.api';
import { useToggleVacationMutation } from '@/hooks/useToggleVacationMutation';
import type { ReviewerWithStats } from '@/types/reviewer';

type Props = {
  reviewers: ReviewerWithStats[];
  maxWeekly: number;
};

export const ReviewersTableBody = ({ reviewers, maxWeekly }: Props) => {
  const toggleMutation = useToggleVacationMutation();

  if (reviewers.length === 0) {
    return (
      <tbody>
        <tr>
          <EmptyCell colSpan={7}>조건에 맞는 리뷰어가 없습니다.</EmptyCell>
        </tr>
      </tbody>
    );
  }

  return (
    <Tbody>
      {reviewers.map((reviewer) => {
        const overdueCount = reviewer.openAssignments.filter(isOverdue).length;
        return (
          <Tr key={reviewer.id}>
            <Td className="strong">{reviewer.display_name}</Td>
            <Td>
              <GithubLink
                href={`https://github.com/${reviewer.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{reviewer.github_username}
              </GithubLink>
            </Td>
            <Td className="num">{reviewer.monthlyCount}</Td>
            <Td className="num">{reviewer.weeklyCount}</Td>
            <Td>
              <GaugeCell>
                <GaugeTrack>
                  <GaugeFill
                    style={{
                      width: `${(reviewer.weeklyCount / maxWeekly) * 100}%`,
                    }}
                  />
                </GaugeTrack>
                <GaugeText>
                  {reviewer.openAssignments.length}건
                  {overdueCount > 0 && <LateText> · 지각</LateText>}
                </GaugeText>
              </GaugeCell>
            </Td>
            <Td>
              <StateBadge $vacation={reviewer.is_on_vacation}>
                {reviewer.is_on_vacation ? '휴가 중' : '활성'}
              </StateBadge>
            </Td>
            <Td>
              <ToggleButton
                aria-label={`${reviewer.display_name} 휴가 상태 토글`}
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
        );
      })}
    </Tbody>
  );
};

export const ReviewersTableBodyLoading = () => (
  <tbody>
    {Array.from({ length: 3 }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: 7 }).map((_, j) => (
          <SkeletonCell key={j}>
            <SkeletonBlock />
          </SkeletonCell>
        ))}
      </tr>
    ))}
  </tbody>
);

export const ReviewersTableBodyError = ({ message }: { message: string }) => (
  <tbody>
    <tr>
      <ErrorCell colSpan={7}>{message}</ErrorCell>
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
  padding: 12px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;

  &.num {
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  &.strong {
    color: ${({ theme }) => theme.colors.gray900};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }
`;

const GithubLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const GaugeCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const GaugeTrack = styled.div`
  width: 80px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  overflow: hidden;

  background: ${({ theme }) => theme.colors.gray100};
`;

const GaugeFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background: ${({ theme }) => theme.colors.primary};
`;

const GaugeText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-variant-numeric: tabular-nums;
`;

const LateText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const StateBadge = styled.span<{ $vacation: boolean }>`
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background: ${({ $vacation }) => ($vacation ? '#FEF3C7' : '#D1FAE5')};
  color: ${({ $vacation }) => ($vacation ? '#92400E' : '#065F46')};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ToggleButton = styled.button`
  padding: 5px 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.xs};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyCell = styled.td`
  padding: ${({ theme }) => theme.spacing.lg};

  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
`;

const ErrorCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.error};
  text-align: center;
`;

const SkeletonCell = styled.td`
  padding: 12px ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const SkeletonBlock = styled.div`
  height: 14px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: ${({ theme }) => theme.colors.gray100};
`;
