import { ApiError } from '@bombom/shared/apis';
import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { ChallengeDetailView } from '@/pages/challenges/ChallengeDetailView';
import {
  ChallengeParticipantsTableBody,
  ChallengeParticipantsTableBodyError,
  ChallengeParticipantsTableBodyLoading,
} from '@/pages/challenges/ChallengeParticipantsTableBody';
import ChallengeUpdateModal from '@/pages/challenges/components/ChallengeUpdateModal';
import { useDeleteChallengeMutation } from '@/pages/challenges/hooks/useDeleteChallengeMutation';

const PARTICIPANTS_PAGE_SIZE = 10;
const PARTICIPANT_TEAM_FILTER_OPTIONS = ['ALL', 'YES', 'NO'] as const;
const PARTICIPANT_SURVIVAL_FILTER_OPTIONS = [
  'ALL',
  'SURVIVED',
  'FAILED',
] as const;
const getParticipantSearchParams = (
  page: number,
  teamId: string,
  hasTeam: 'ALL' | 'YES' | 'NO',
  survival: 'ALL' | 'SURVIVED' | 'FAILED',
) => ({
  page: page > 0 ? page : undefined,
  teamId: teamId.trim() ? teamId : undefined,
  hasTeam: hasTeam !== 'ALL' ? hasTeam : undefined,
  survival: survival !== 'ALL' ? survival : undefined,
});

export const Route = createFileRoute('/_admin/challenges/$challengeId/')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawHasTeam =
      typeof search.hasTeam === 'string' ? search.hasTeam : 'ALL';
    const rawSurvival =
      typeof search.survival === 'string' ? search.survival : 'ALL';

    return {
      page: Math.max(Number(search.page ?? 0) || 0, 0),
      teamId:
        typeof search.teamId === 'string' && search.teamId.trim()
          ? search.teamId
          : undefined,
      hasTeam: PARTICIPANT_TEAM_FILTER_OPTIONS.includes(
        rawHasTeam as (typeof PARTICIPANT_TEAM_FILTER_OPTIONS)[number],
      )
        ? rawHasTeam === 'ALL'
          ? undefined
          : rawHasTeam
        : undefined,
      survival: PARTICIPANT_SURVIVAL_FILTER_OPTIONS.includes(
        rawSurvival as (typeof PARTICIPANT_SURVIVAL_FILTER_OPTIONS)[number],
      )
        ? rawSurvival === 'ALL'
          ? undefined
          : rawSurvival
        : undefined,
    };
  },
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
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();
  const [participantsTotal, setParticipantsTotal] = useState(0);
  const [participantsTotalPages, setParticipantsTotalPages] = useState(0);
  const [shieldCountInput, setShieldCountInput] = useState('1');
  const [isShieldModalOpen, setIsShieldModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const id = Number(challengeId);

  const queryClient = useQueryClient();
  const { data: challenge } = useSuspenseQuery(challengesQueries.detail(id));
  const { data: teams } = useSuspenseQuery(challengesQueries.teams(id));

  const challengeTeamId = useMemo(() => {
    const trimmed = (search.teamId ?? '').trim();
    if (!trimmed) {
      return undefined;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [search.teamId]);

  const hasTeam = useMemo(() => {
    if (!search.hasTeam) {
      return undefined;
    }

    return search.hasTeam === 'YES';
  }, [search.hasTeam]);

  const isSurvived = useMemo(() => {
    if (!search.survival) {
      return undefined;
    }

    return search.survival === 'SURVIVED';
  }, [search.survival]);

  const shieldCount = useMemo(() => {
    const trimmed = shieldCountInput.trim();
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [shieldCountInput]);

  const handleParticipantsDataLoaded = useCallback(
    (totalElements: number, totalPages: number) => {
      setParticipantsTotal(totalElements);
      setParticipantsTotalPages(totalPages);
    },
    [],
  );

  const handleParticipantsPageChange = (page: number) => {
    if (page < 0 || page === search.page || page >= participantsTotalPages) {
      return;
    }

    navigate({
      search: getParticipantSearchParams(
        page,
        search.teamId ?? '',
        search.hasTeam ?? 'ALL',
        search.survival ?? 'ALL',
      ),
    });
  };

  const handleTeamIdChange = (value: string) => {
    navigate({
      search: getParticipantSearchParams(
        0,
        value,
        search.hasTeam ?? 'ALL',
        search.survival ?? 'ALL',
      ),
    });
  };

  const handleHasTeamChange = (value: 'ALL' | 'YES' | 'NO') => {
    navigate({
      search: getParticipantSearchParams(
        0,
        search.teamId ?? '',
        value,
        search.survival ?? 'ALL',
      ),
    });
  };

  const handleSurvivalChange = (value: 'ALL' | 'SURVIVED' | 'FAILED') => {
    navigate({
      search: getParticipantSearchParams(
        0,
        search.teamId ?? '',
        search.hasTeam ?? 'ALL',
        value,
      ),
    });
  };

  const { mutate: grantShield, isPending: isGrantingShield } = useMutation({
    ...challengesQueries.mutation.grantParticipantsShield(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['challenges', 'participants', id],
      });
      setIsShieldModalOpen(false);
      alert('쉴드 지급이 완료되었습니다.');
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        alert(error.message);
        return;
      }
      alert('쉴드 지급에 실패했습니다.');
    },
  });
  const { mutate: deleteChallenge, isPending: isDeletingChallenge } =
    useDeleteChallengeMutation({
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate({ to: '/challenges', search: { page: 0, size: 10 } } as any);
      },
    });

  const handleManageTeams = () => {
    navigate({
      to: '/challenges/$challengeId/teams',
      params: { challengeId },
    });
  };

  const handleBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/challenges', search: { page: 0, size: 10 } } as any);
  };

  const handleGrantShield = () => {
    if (shieldCount <= 0) {
      alert('쉴드 개수는 1 이상 입력해주세요.');
      return;
    }

    if (confirm(`생존자에게 쉴드 ${shieldCount}개를 지급할까요?`)) {
      grantShield({ challengeId: id, count: shieldCount });
    }
  };

  const handleOpenShieldModal = () => {
    setIsShieldModalOpen(true);
  };

  const handleCloseShieldModal = () => {
    setIsShieldModalOpen(false);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleDeleteChallenge = () => {
    if (
      !confirm(
        '정말 이 챌린지를 삭제하시겠습니까?\n참여자가 있으면 삭제할 수 없습니다.',
      )
    ) {
      return;
    }

    deleteChallenge(id);
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
      <DetailActions>
        <Button variant="secondary" onClick={handleOpenUpdateModal}>
          수정
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteChallenge}
          disabled={isDeletingChallenge}
        >
          {isDeletingChallenge ? '삭제 중...' : '삭제'}
        </Button>
        <Button onClick={handleBack}>목록</Button>
      </DetailActions>

      {isUpdateModalOpen && (
        <ChallengeUpdateModal
          challenge={challenge}
          onClose={handleCloseUpdateModal}
        />
      )}

      <ParticipantsSection>
        <ParticipantsHeader>
          <ParticipantsTitle>참여자 ({participantsTotal}명)</ParticipantsTitle>
          <ParticipantsActions>
            <Button onClick={handleOpenShieldModal}>쉴드 지급</Button>
            <Button variant="secondary" onClick={handleManageTeams}>
              팀 관리
            </Button>
          </ParticipantsActions>
        </ParticipantsHeader>
        {isShieldModalOpen && (
          <ModalOverlay onClick={handleCloseShieldModal}>
            <ModalCard onClick={(event) => event.stopPropagation()}>
              <ModalTitle>쉴드 일괄 지급</ModalTitle>
              <ModalContent>
                <InputGroup>
                  <ShieldLabel htmlFor="shield-count">지급 개수</ShieldLabel>
                  <ShieldInput
                    id="shield-count"
                    type="number"
                    min="1"
                    value={shieldCountInput}
                    onChange={(event) =>
                      setShieldCountInput(event.target.value)
                    }
                  />
                </InputGroup>
                <ModalNotice>
                  생존자에게 설정한 개수만큼 쉴드를 일괄 지급합니다.
                </ModalNotice>
              </ModalContent>
              <ModalActions>
                <Button variant="secondary" onClick={handleCloseShieldModal}>
                  취소
                </Button>
                <Button onClick={handleGrantShield} disabled={isGrantingShield}>
                  {isGrantingShield ? '지급 중...' : '지급'}
                </Button>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
        <Filters>
          <FilterGroup>
            <FilterLabel htmlFor="challenge-team-id">팀 ID</FilterLabel>
            <FilterSelect
              id="challenge-team-id"
              value={search.teamId ?? ''}
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
            <FilterLabel htmlFor="challenge-has-team">팀 매칭</FilterLabel>
            <FilterSelect
              id="challenge-has-team"
              value={search.hasTeam ?? 'ALL'}
              onChange={(event) =>
                handleHasTeamChange(event.target.value as 'ALL' | 'YES' | 'NO')
              }
            >
              <option value="ALL">전체</option>
              <option value="YES">매칭됨</option>
              <option value="NO">미매칭</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="challenge-survival">상태</FilterLabel>
            <FilterSelect
              id="challenge-survival"
              value={search.survival ?? 'ALL'}
              onChange={(event) =>
                handleSurvivalChange(
                  event.target.value as 'ALL' | 'SURVIVED' | 'FAILED',
                )
              }
            >
              <option value="ALL">전체</option>
              <option value="SURVIVED">생존</option>
              <option value="FAILED">탈락</option>
            </FilterSelect>
          </FilterGroup>
        </Filters>

        <Table>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <Thead>
            <Tr>
              <Th>닉네임</Th>
              <Th>팀 ID</Th>
              <Th>완료 일수</Th>
              <Th>쉴드</Th>
              <Th>상태</Th>
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
                currentPage={search.page}
                pageSize={PARTICIPANTS_PAGE_SIZE}
                challengeTeamId={challengeTeamId}
                hasTeam={hasTeam}
                isSurvived={isSurvived}
                onDataLoaded={handleParticipantsDataLoaded}
                editable={false}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {participantsTotal > 0 && participantsTotalPages > 0 && (
          <Pagination
            totalCount={participantsTotal}
            totalPages={participantsTotalPages}
            currentPage={search.page}
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

const DetailActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ParticipantsHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const ParticipantsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const ParticipantsActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

const ShieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ShieldInput = styled.input`
  width: 100%;
  max-width: 220px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 45%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(420px, 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ModalTitle = styled.h4`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ModalContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const ModalNotice = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const Filters = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
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
