import { ApiError } from '@bombom/shared/apis';
import styled from '@emotion/styled';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { Button } from '@/components/Button';

interface ChallengeParticipantsTableBodyProps {
  challengeId: number;
  currentPage: number;
  pageSize: number;
  challengeTeamId?: number;
  hasTeam?: boolean;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
  editable?: boolean;
}

export const ChallengeParticipantsTableBody = ({
  challengeId,
  currentPage,
  pageSize,
  challengeTeamId,
  hasTeam,
  onDataLoaded,
  editable = false,
}: ChallengeParticipantsTableBodyProps) => {
  const queryClient = useQueryClient();
  const isEditable = editable;
  const [editingParticipantId, setEditingParticipantId] = useState<
    number | null
  >(null);
  const [teamInput, setTeamInput] = useState('');

  const { data } = useSuspenseQuery(
    challengesQueries.participants(challengeId, {
      page: currentPage,
      size: pageSize,
      challengeTeamId,
      hasTeam,
    }),
  );

  const { data: teams } = useQuery({
    ...challengesQueries.teams(challengeId),
    enabled: isEditable,
  });

  const { mutate: updateTeam, isPending: isUpdating } = useMutation({
    ...challengesQueries.mutation.updateParticipantTeam(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'participants', challengeId],
      });
      setEditingParticipantId(null);
      setTeamInput('');
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('팀 변경에 실패했습니다.');
    },
  });

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data.totalElements ?? 0, data.totalPages ?? 0);
    }
  }, [data, onDataLoaded]);

  const handleRowClick = (participantId: number, teamId: number | null) => {
    if (!isEditable) {
      return;
    }

    setEditingParticipantId(participantId);
    setTeamInput(teamId?.toString() ?? '');
  };

  const handleCancel = () => {
    setEditingParticipantId(null);
    setTeamInput('');
  };

  const handleSave = (participantId: number) => {
    if (!isEditable) {
      return;
    }

    if (!teams?.length) {
      alert('배정 가능한 팀이 없습니다.');
      return;
    }

    const trimmed = teamInput.trim();
    const parsed = Number(trimmed);
    if (!trimmed || Number.isNaN(parsed) || parsed <= 0) {
      alert('유효한 팀 ID를 입력해주세요.');
      return;
    }

    updateTeam({
      challengeId,
      participantId,
      challengeTeamId: parsed,
    });
  };

  const columnCount = isEditable ? 5 : 4;

  if (data?.content.length === 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={columnCount}>
            <EmptyState>참여자 목록이 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data?.content.map((participant) => (
        <Tr
          key={participant.participantId}
          isEditing={editingParticipantId === participant.participantId}
          isEditable={isEditable}
          onClick={
            isEditable
              ? () =>
                  handleRowClick(
                    participant.participantId,
                    participant.challengeTeamId,
                  )
              : undefined
          }
        >
          <Td>{participant.nickname}</Td>
          <Td>
            {isEditable &&
            editingParticipantId === participant.participantId ? (
              <TeamSelect
                value={teamInput}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setTeamInput(event.target.value)}
              >
                <option value="" disabled>
                  팀 선택
                </option>
                {teams?.length ? (
                  teams.map((team) => (
                    <option key={team.id} value={team.id.toString()}>
                      {team.id} (진행률 {team.progress}%)
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    생성된 팀 없음
                  </option>
                )}
              </TeamSelect>
            ) : (
              (participant.challengeTeamId ?? '-')
            )}
          </Td>
          <Td>{participant.completedDays}</Td>
          <Td>{participant.isSurvived ? '생존' : '탈락'}</Td>
          {isEditable && (
            <Td>
              {editingParticipantId === participant.participantId ? (
                <ActionGroup onClick={(event) => event.stopPropagation()}>
                  <Button
                    size="sm"
                    onClick={() => handleSave(participant.participantId)}
                    disabled={isUpdating || !teams?.length}
                  >
                    저장
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    취소
                  </Button>
                </ActionGroup>
              ) : (
                <ActionHint>행을 클릭해 변경</ActionHint>
              )}
            </Td>
          )}
        </Tr>
      ))}
    </Tbody>
  );
};

export const ChallengeParticipantsTableBodyLoading = ({
  colSpan = 4,
}: {
  colSpan?: number;
}) => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={colSpan}>
          <EmptyState>참여자 목록을 불러오는 중...</EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

export const ChallengeParticipantsTableBodyError = ({
  colSpan = 4,
}: {
  colSpan?: number;
}) => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={colSpan}>
          <ErrorMessage>참여자 목록을 불러오는데 실패했습니다.</ErrorMessage>
        </Td>
      </Tr>
    </Tbody>
  );
};

const Tbody = styled.tbody``;

const Tr = styled.tr<{ isEditing?: boolean; isEditable?: boolean }>`
  cursor: ${({ isEditable }) => (isEditable ? 'pointer' : 'default')};

  &:hover {
    background-color: ${({ theme, isEditing }) =>
      isEditing ? theme.colors.gray100 : theme.colors.gray50};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;

  &:nth-of-type(2),
  &:nth-of-type(3),
  &:nth-of-type(4),
  &:nth-of-type(5) {
    text-align: center;
  }
`;

const TeamSelect = styled.select`
  width: 100%;
  max-width: 180px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const ActionHint = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
