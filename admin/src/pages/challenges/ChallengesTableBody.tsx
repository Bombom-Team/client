import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import type { ChallengeStatus } from '@/types/challenge';

interface ChallengesTableBodyProps {
  currentPage: number;
  pageSize: number;
  status?: ChallengeStatus;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
}

export function ChallengesTableBody({
  currentPage,
  pageSize,
  status,
  onDataLoaded,
}: ChallengesTableBodyProps) {
  const { data } = useSuspenseQuery(
    challengesQueries.list({
      page: currentPage,
      size: pageSize,
      status,
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
            <EmptyState>조건에 해당하는 챌린지가 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data?.content.map((challenge) => (
        <Tr key={challenge.id}>
          <Td>{challenge.id}</Td>
          <Td>{challenge.name}</Td>
          <Td>{challenge.generation}기</Td>
          <Td>{challenge.startDate}</Td>
          <Td>{challenge.endDate}</Td>
        </Tr>
      ))}
    </Tbody>
  );
}

ChallengesTableBody.Loading = function ChallengesTableBodyLoading() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <EmptyState>챌린지 목록을 불러오는 중...</EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

ChallengesTableBody.Error = function ChallengesTableBodyError() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <ErrorMessage>챌린지 목록을 불러오는데 실패했습니다.</ErrorMessage>
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
