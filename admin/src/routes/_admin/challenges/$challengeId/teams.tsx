import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import {
  ChallengeParticipantsTableBody,
  ChallengeParticipantsTableBodyError,
  ChallengeParticipantsTableBodyLoading,
} from '@/pages/challenges/ChallengeParticipantsTableBody';

const PARTICIPANTS_PAGE_SIZE = 10;

export const Route = createFileRoute('/_admin/challenges/$challengeId/teams')({
  component: ChallengeTeamsPage,
});

function ChallengeTeamsPage() {
  return (
    <Layout title="팀 관리">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <ChallengeTeamsContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function ChallengeTeamsContent() {
  const { challengeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [participantsPage, setParticipantsPage] = useState(0);
  const [participantsTotal, setParticipantsTotal] = useState(0);
  const [participantsTotalPages, setParticipantsTotalPages] = useState(0);
  const [teamIdInput, setTeamIdInput] = useState('');
  const [hasTeamFilter, setHasTeamFilter] = useState<'ALL' | 'YES' | 'NO'>(
    'ALL',
  );
  const [maxTeamSizeInput, setMaxTeamSizeInput] = useState('15');
  const [createCountInput, setCreateCountInput] = useState('1');

  const id = Number(challengeId);

  const { data: challenge } = useSuspenseQuery(challengesQueries.detail(id));
  const { data: teams } = useSuspenseQuery(challengesQueries.teams(id));

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

  const maxTeamSize = useMemo(() => {
    const trimmed = maxTeamSizeInput.trim();
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [maxTeamSizeInput]);

  const createCount = useMemo(() => {
    const trimmed = createCountInput.trim();
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [createCountInput]);

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

  const { mutate: assignTeams, isPending: isAssigningTeams } = useMutation({
    ...challengesQueries.mutation.assignTeams(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'teams', id] });
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'participants', id],
      });
      alert('팀 자동 배정이 완료되었습니다.');
    },
    onError: () => {
      alert('팀 자동 배정에 실패했습니다.');
    },
  });

  const { mutate: createTeams, isPending: isCreatingTeams } = useMutation({
    ...challengesQueries.mutation.createTeams(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'teams', id] });
      alert('팀 생성이 완료되었습니다.');
      setCreateCountInput('1');
    },
    onError: () => {
      alert('팀 생성에 실패했습니다.');
    },
  });

  const { mutate: deleteTeam, isPending: isDeletingTeam } = useMutation({
    ...challengesQueries.mutation.deleteTeam(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges', 'teams', id] });
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'participants', id],
      });
      alert('팀 삭제가 완료되었습니다.');
    },
    onError: () => {
      alert('팀 삭제에 실패했습니다.');
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

  const handleCreateTeams = () => {
    if (createCount <= 0) {
      alert('생성할 팀 개수는 1 이상 입력해주세요.');
      return;
    }

    createTeams({ challengeId: id, count: createCount });
  };

  const handleDeleteTeam = (teamId: number) => {
    if (confirm('해당 팀을 삭제하시겠습니까?')) {
      deleteTeam({ challengeId: id, teamId });
    }
  };

  const handleGoToDetail = () => {
    navigate({
      to: '/challenges/$challengeId',
      params: { challengeId },
    });
  };

  return (
    <Container>
      <Header>
        <Title>{challenge?.name ?? '팀 관리'}</Title>
        <Button variant="secondary" onClick={handleGoToDetail}>
          챌린지 상세
        </Button>
      </Header>

      <Section>
        <SectionHeader>
          <SectionTitle>팀 자동 배정</SectionTitle>
        </SectionHeader>
        <Notice>팀이 자동으로 생성되며 참여자는 랜덤으로 배정됩니다.</Notice>
        <ActionRow>
          <Label htmlFor="max-team-size">팀 최대 인원</Label>
          <Input
            id="max-team-size"
            type="number"
            min="1"
            value={maxTeamSizeInput}
            onChange={(event) => setMaxTeamSizeInput(event.target.value)}
          />
          <Button onClick={handleAssignTeams} disabled={isAssigningTeams}>
            {isAssigningTeams ? '배정 중...' : '자동 배정'}
          </Button>
        </ActionRow>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>팀 생성/삭제</SectionTitle>
        </SectionHeader>
        <Notice>
          입력한 개수만큼 팀이 자동으로 생성됩니다. 팀 자동 배정을 이미
          실행했다면 보통 추가 생성은 필요하지 않습니다.
        </Notice>
        <ActionRow>
          <Label htmlFor="create-team-count">생성 개수</Label>
          <Input
            id="create-team-count"
            type="number"
            min="1"
            value={createCountInput}
            onChange={(event) => setCreateCountInput(event.target.value)}
          />
          <Button
            variant="secondary"
            onClick={handleCreateTeams}
            disabled={isCreatingTeams}
          >
            {isCreatingTeams ? '생성 중...' : '팀 생성'}
          </Button>
        </ActionRow>
        <TeamsTable>
          <colgroup>
            <col style={{ width: '35%' }} />
            <col style={{ width: '35%' }} />
            <col style={{ width: '30%' }} />
          </colgroup>
          <Thead>
            <Tr>
              <Th>팀 ID</Th>
              <Th>진행률</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teams?.length ? (
              teams.map((team) => (
                <Tr key={team.id}>
                  <Td>{team.id}</Td>
                  <Td>{team.progress}%</Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteTeam(team.id)}
                      disabled={isDeletingTeam}
                    >
                      삭제
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3}>
                  <EmptyState>생성된 팀이 없습니다.</EmptyState>
                </Td>
              </Tr>
            )}
          </Tbody>
        </TeamsTable>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>참여자 팀 관리</SectionTitle>
        </SectionHeader>
        <Filters>
          <FilterGroup>
            <FilterLabel htmlFor="participant-team-id">팀 ID</FilterLabel>
            <FilterSelect
              id="participant-team-id"
              value={teamIdInput}
              onChange={(event) => handleTeamIdChange(event.target.value)}
            >
              <option value="">전체</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id.toString()}>
                  {team.id}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="participant-has-team">팀 매칭</FilterLabel>
            <FilterSelect
              id="participant-has-team"
              value={hasTeamFilter}
              onChange={(event) =>
                handleHasTeamChange(event.target.value as 'ALL' | 'YES' | 'NO')
              }
            >
              <option value="ALL">전체</option>
              <option value="YES">매칭됨</option>
              <option value="NO">미매칭</option>
            </FilterSelect>
          </FilterGroup>
        </Filters>
        <ParticipantsTable>
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
          <ErrorBoundary
            fallback={<ChallengeParticipantsTableBodyError colSpan={5} />}
          >
            <Suspense
              fallback={<ChallengeParticipantsTableBodyLoading colSpan={5} />}
            >
              <ChallengeParticipantsTableBody
                challengeId={id}
                currentPage={participantsPage}
                pageSize={PARTICIPANTS_PAGE_SIZE}
                challengeTeamId={challengeTeamId}
                hasTeam={hasTeam}
                onDataLoaded={handleParticipantsDataLoaded}
                editable
              />
            </Suspense>
          </ErrorBoundary>
        </ParticipantsTable>

        {participantsTotal > 0 && participantsTotalPages > 0 && (
          <Pagination
            totalCount={participantsTotal}
            totalPages={participantsTotalPages}
            currentPage={participantsPage}
            onPageChange={handleParticipantsPageChange}
            countUnitLabel="명"
          />
        )}
      </Section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Notice = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Input = styled.input`
  max-width: 160px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TeamsTable = styled.table`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-collapse: collapse;
  table-layout: fixed;
`;

const ParticipantsTable = styled.table`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  border-collapse: collapse;
  table-layout: fixed;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
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

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: flex-end;
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
