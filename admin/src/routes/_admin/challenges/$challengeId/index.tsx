import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { ChallengeDetailView } from '@/pages/challenges/ChallengeDetailView';
import {
  ChallengeParticipantsTableBody,
  ChallengeParticipantsTableBodyError,
  ChallengeParticipantsTableBodyLoading,
} from '@/pages/challenges/ChallengeParticipantsTableBody';

const PARTICIPANTS_PAGE_SIZE = 10;

export const Route = createFileRoute('/_admin/challenges/$challengeId/')({
  component: ChallengeDetailPage,
});

function ChallengeDetailPage() {
  return (
    <Layout title="챌린지 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <ChallengeDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function ChallengeDetailContent() {
  const { challengeId } = Route.useParams();
  const [participantsPage, setParticipantsPage] = useState(0);
  const [participantsTotal, setParticipantsTotal] = useState(0);
  const [participantsTotalPages, setParticipantsTotalPages] = useState(0);
  const [teamIdInput, setTeamIdInput] = useState('');
  const [hasTeamFilter, setHasTeamFilter] = useState<'ALL' | 'YES' | 'NO'>(
    'ALL',
  );
  const [maxTeamSizeInput, setMaxTeamSizeInput] = useState('15');
  const queryClient = useQueryClient();

  const id = Number(challengeId);

  const { data: challenge } = useSuspenseQuery(challengesQueries.detail(id));

  const challengeTeamId = useMemo(() => {
    const trimmed = teamIdInput.trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [teamIdInput]);

  const hasTeam = useMemo(() => {
    if (hasTeamFilter === 'ALL') {
      return undefined;
    }

    return hasTeamFilter === 'YES';
  }, [hasTeamFilter]);

  const handleParticipantsDataLoaded = useCallback(
    (totalElements: number, totalPages: number) => {
      setParticipantsTotal(totalElements);
      setParticipantsTotalPages(totalPages);
    },
    [],
  );

  const handleParticipantsPageChange = (page: number) => {
    if (
      page < 0 ||
      page === participantsPage ||
      page >= participantsTotalPages
    ) {
      return;
    }

    setParticipantsPage(page);
  };

  const handleTeamIdChange = (value: string) => {
    setTeamIdInput(value);
    setParticipantsPage(0);
  };

  const handleHasTeamChange = (value: 'ALL' | 'YES' | 'NO') => {
    setHasTeamFilter(value);
    setParticipantsPage(0);
  };

  const maxTeamSize = useMemo(() => {
    const trimmed = maxTeamSizeInput.trim();
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [maxTeamSizeInput]);

  const { mutate: assignTeams, isPending: isAssigningTeams } = useMutation({
    ...challengesQueries.mutation.assignTeams(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'participants', id],
      });
      alert('팀 자동 배정이 완료되었습니다.');
    },
    onError: () => {
      alert('팀 자동 배정에 실패했습니다.');
    },
  });

  const handleAssignTeams = () => {
    if (maxTeamSize <= 0) {
      alert('팀 최대 인원은 1명 이상 입력해주세요.');
      return;
    }

    if (
      confirm(
        '이미 팀이 배정된 경우 기존 배정이 초기화되고 재배정됩니다. 진행할까요?',
      )
    ) {
      assignTeams({ challengeId: id, maxTeamSize });
    }
  };

  if (!challenge) {
    return (
      <Container>
        <div>챌린지를 찾을 수 없습니다.</div>
      </Container>
    );
  }

  return (
    <ChallengeDetailView challenge={challenge}>
      <ParticipantsSection>
        <ParticipantsHeader>
          <ParticipantsTitle>참여자 ({participantsTotal}명)</ParticipantsTitle>
          <Controls>
            <ControlsRow>
              <ControlsLabel>팀 자동 배정</ControlsLabel>
              <FilterGroup>
                <FilterLabel htmlFor="challenge-max-team-size">
                  팀 최대 인원
                </FilterLabel>
                <FilterInput
                  id="challenge-max-team-size"
                  type="number"
                  min="1"
                  placeholder="15"
                  value={maxTeamSizeInput}
                  onChange={(event) => setMaxTeamSizeInput(event.target.value)}
                />
                <AssignButton
                  type="button"
                  onClick={handleAssignTeams}
                  disabled={isAssigningTeams}
                >
                  {isAssigningTeams ? '배정 중...' : '팀 자동 배정'}
                </AssignButton>
              </FilterGroup>
            </ControlsRow>
            <ControlsDivider />
            <ControlsRow>
              <ControlsLabel>목록 필터</ControlsLabel>
              <FilterGroup>
                <FilterLabel htmlFor="challenge-team-id">팀 ID</FilterLabel>
                <FilterInput
                  id="challenge-team-id"
                  type="number"
                  placeholder="팀 ID"
                  value={teamIdInput}
                  onChange={(event) => handleTeamIdChange(event.target.value)}
                />
              </FilterGroup>
              <FilterGroup>
                <FilterLabel htmlFor="challenge-has-team">팀 매칭</FilterLabel>
                <FilterSelect
                  id="challenge-has-team"
                  value={hasTeamFilter}
                  onChange={(event) =>
                    handleHasTeamChange(
                      event.target.value as 'ALL' | 'YES' | 'NO',
                    )
                  }
                >
                  <option value="ALL">전체</option>
                  <option value="YES">매칭됨</option>
                  <option value="NO">미매칭</option>
                </FilterSelect>
              </FilterGroup>
            </ControlsRow>
          </Controls>
        </ParticipantsHeader>

        <Table>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
          </colgroup>
          <Thead>
            <Tr>
              <Th>닉네임</Th>
              <Th>팀 ID</Th>
              <Th>완료 일수</Th>
              <Th>상태</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <ErrorBoundary fallback={<ChallengeParticipantsTableBodyError />}>
            <Suspense fallback={<ChallengeParticipantsTableBodyLoading />}>
              <ChallengeParticipantsTableBody
                challengeId={id}
                currentPage={participantsPage}
                pageSize={PARTICIPANTS_PAGE_SIZE}
                challengeTeamId={challengeTeamId}
                hasTeam={hasTeam}
                onDataLoaded={handleParticipantsDataLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {participantsTotal > 0 && participantsTotalPages > 0 && (
          <Pagination
            totalCount={participantsTotal}
            totalPages={participantsTotalPages}
            currentPage={participantsPage}
            onPageChange={handleParticipantsPageChange}
            countUnitLabel="명"
          />
        )}
      </ParticipantsSection>
    </ChallengeDetailView>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ParticipantsSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ParticipantsHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

const ParticipantsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
`;

const ControlsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: flex-end;
`;

const ControlsLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const ControlsDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray200};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const FilterLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FilterInput = styled.input`
  max-width: 140px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  min-width: 120px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AssignButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid transparent;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};

  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;

  &:nth-of-type(2),
  &:nth-of-type(3),
  &:nth-of-type(4),
  &:nth-of-type(5) {
    text-align: center;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;
