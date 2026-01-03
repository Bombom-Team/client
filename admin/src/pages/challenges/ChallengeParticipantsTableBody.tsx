import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { challengesQueries } from '@/apis/challenges/challenges.query';

interface ChallengeParticipantsTableBodyProps {
  challengeId: number;
  currentPage: number;
  pageSize: number;
  challengeTeamId?: number;
  hasTeam?: boolean;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
}

export const ChallengeParticipantsTableBody = ({
  challengeId,
  currentPage,
  pageSize,
  challengeTeamId,
  hasTeam,
  onDataLoaded,
}: ChallengeParticipantsTableBodyProps) => {
  const { data } = useSuspenseQuery(
    challengesQueries.participants(challengeId, {
      page: currentPage,
      size: pageSize,
      challengeTeamId,
      hasTeam,
    }),
  );

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data.totalElements ?? 0, data.totalPages ?? 0);
    }
  }, [data, onDataLoaded]);

  if (data?.content.length === 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={5}>
            <EmptyState>참여자 목록이 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data?.content.map((participant) => (
        <Tr key={participant.memberId}>
          <Td>{participant.memberId}</Td>
          <Td>{participant.nickname}</Td>
          <Td>{participant.challengeTeamId ?? '-'}</Td>
          <Td>{participant.completedDays}</Td>
          <Td>{participant.isSurvived ? '생존' : '탈락'}</Td>
        </Tr>
      ))}
    </Tbody>
  );
};

export const ChallengeParticipantsTableBodyLoading = () => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <EmptyState>참여자 목록을 불러오는 중...</EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

export const ChallengeParticipantsTableBodyError = () => {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <ErrorMessage>참여자 목록을 불러오는데 실패했습니다.</ErrorMessage>
        </Td>
      </Tr>
    </Tbody>
  );
};

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

  &:nth-of-type(3),
  &:nth-of-type(4),
  &:nth-of-type(5) {
    text-align: center;
  }
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
