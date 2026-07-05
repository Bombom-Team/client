import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { isOverdue } from '@/apis/reviewers/reviewers.api';
import {
  useDeleteReviewerMutation,
  useUpdateReviewerNameMutation,
} from '@/hooks/useReviewerAdminMutations';
import { useToggleVacationMutation } from '@/hooks/useToggleVacationMutation';
import type { ReviewerWithStats } from '@/types/reviewer';

type Props = {
  reviewers: ReviewerWithStats[];
  maxWeekly: number;
};

export const ReviewersTableBody = ({ reviewers, maxWeekly }: Props) => {
  const toggleMutation = useToggleVacationMutation();
  const deleteMutation = useDeleteReviewerMutation();
  const nameMutation = useUpdateReviewerNameMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // 편집 모드 진입 시 1회만 자동 포커스 (편집 중 input은 항상 하나)
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editingId !== null) nameInputRef.current?.focus();
  }, [editingId]);

  const startEdit = (reviewer: ReviewerWithStats) => {
    setEditingId(reviewer.id);
    setEditingName(reviewer.display_name);
  };

  const saveName = (reviewerId: number) => {
    const displayName = editingName.trim();
    if (!displayName) return;
    nameMutation.mutate(
      { reviewerId, displayName },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = (reviewerId: number) => {
    if (deleteConfirmId !== reviewerId) {
      setDeleteConfirmId(reviewerId);
      return;
    }
    deleteMutation.mutate(reviewerId, {
      onSettled: () => setDeleteConfirmId(null),
    });
  };

  if (reviewers.length === 0) {
    return (
      <tbody>
        <tr>
          <EmptyCell colSpan={8}>조건에 맞는 리뷰어가 없습니다.</EmptyCell>
        </tr>
      </tbody>
    );
  }

  return (
    <Tbody>
      {deleteMutation.isError && (
        <tr>
          <ErrorCell colSpan={8}>
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : '삭제에 실패했습니다.'}
          </ErrorCell>
        </tr>
      )}
      {reviewers.map((reviewer) => {
        const overdueCount = reviewer.openAssignments.filter(isOverdue).length;
        return (
          <Tr key={reviewer.id}>
            <Td className="strong">
              {editingId === reviewer.id ? (
                <NameEditRow>
                  <NameInput
                    value={editingName}
                    ref={nameInputRef}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveName(reviewer.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <MiniButton
                    onClick={() => saveName(reviewer.id)}
                    disabled={nameMutation.isPending}
                  >
                    저장
                  </MiniButton>
                  <MiniButton onClick={() => setEditingId(null)}>
                    취소
                  </MiniButton>
                </NameEditRow>
              ) : (
                reviewer.display_name
              )}
            </Td>
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
            <Td>
              <ManageCell>
                <MiniButton
                  aria-label={`${reviewer.display_name} 이름 변경`}
                  onClick={() => startEdit(reviewer)}
                >
                  이름 변경
                </MiniButton>
                <DeleteButton
                  aria-label={`${reviewer.display_name} 삭제`}
                  $confirming={deleteConfirmId === reviewer.id}
                  onClick={() => handleDelete(reviewer.id)}
                  onBlur={() => setDeleteConfirmId(null)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteConfirmId === reviewer.id ? '한 번 더 클릭' : '삭제'}
                </DeleteButton>
              </ManageCell>
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
        {Array.from({ length: 8 }).map((_, j) => (
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
      <ErrorCell colSpan={8}>{message}</ErrorCell>
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

const NameEditRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const NameInput = styled.input`
  width: 90px;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
  }
`;

const ManageCell = styled.div`
  display: flex;
  gap: 4px;
`;

const MiniButton = styled.button`
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.xs};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button<{ $confirming: boolean }>`
  padding: 4px 10px;
  border: 1px solid
    ${({ theme, $confirming }) =>
      $confirming ? theme.colors.error : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: ${({ theme, $confirming }) =>
    $confirming ? '#FEE2E2' : theme.colors.white};
  color: ${({ theme, $confirming }) =>
    $confirming ? theme.colors.error : theme.colors.gray600};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme, $confirming }) =>
    $confirming ? theme.fontWeight.semibold : theme.fontWeight.normal};
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
