import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Fragment, useEffect, useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import ChallengeScheduleCalendar from '@/pages/challenges/components/ChallengeScheduleCalendar';
import type { ChallengeStatus } from '@/types/challenge';

interface ChallengesTableBodyProps {
  currentPage: number;
  pageSize: number;
  status?: ChallengeStatus;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
  variant?: 'default' | 'daily-guide';
}

export function ChallengesTableBody({
  currentPage,
  pageSize,
  status,
  onDataLoaded,
  variant = 'default',
}: ChallengesTableBodyProps) {
  const navigate = useNavigate();
  const [expandedChallengeIds, setExpandedChallengeIds] = useState<number[]>(
    [],
  );
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
          <Td colSpan={variant === 'daily-guide' ? 6 : 5}>
            <EmptyState>조건에 해당하는 챌린지가 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data?.content.map((challenge) => (
        <Fragment key={challenge.id}>
          <Tr
            onClick={
              variant === 'default'
                ? () =>
                    navigate({
                      to: '/challenges/$challengeId',
                      params: { challengeId: challenge.id.toString() },
                    })
                : undefined
            }
            isClickable={variant === 'default'}
          >
            {variant === 'daily-guide' && (
              <Td>
                <ToggleButton
                  type="button"
                  isExpanded={expandedChallengeIds.includes(challenge.id)}
                  onClick={() =>
                    setExpandedChallengeIds((previousIds) =>
                      previousIds.includes(challenge.id)
                        ? previousIds.filter((id) => id !== challenge.id)
                        : [...previousIds, challenge.id],
                    )
                  }
                >
                  <ToggleIconBox>
                    {expandedChallengeIds.includes(challenge.id) ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </ToggleIconBox>
                  <span>
                    {expandedChallengeIds.includes(challenge.id)
                      ? '일정 숨기기'
                      : '일정 보기'}
                  </span>
                </ToggleButton>
              </Td>
            )}
            <Td>{challenge.id}</Td>
            <Td>{challenge.name}</Td>
            <Td>{challenge.generation}기</Td>
            <Td>{challenge.startDate}</Td>
            <Td>{challenge.endDate}</Td>
          </Tr>
          {variant === 'daily-guide' &&
            expandedChallengeIds.includes(challenge.id) && (
              <ExpandedTr>
                <ExpandedTd colSpan={6}>
                  <ExpandedContentBox>
                    <ExpandedHeaderBox>
                      <ExpandedTitle>챌린지 일정</ExpandedTitle>
                      <ExpandedDescription>
                        펼친 시점에 일정 API를 호출해 달력을 렌더링합니다.
                      </ExpandedDescription>
                    </ExpandedHeaderBox>
                    <ChallengeScheduleCalendar challengeId={challenge.id} />
                  </ExpandedContentBox>
                </ExpandedTd>
              </ExpandedTr>
            )}
        </Fragment>
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

const Tr = styled.tr<{ isClickable?: boolean }>`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'default')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const ExpandedTr = styled.tr`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ExpandedTd = styled(Td)`
  padding: 0;
`;

const ToggleButton = styled.button<{ isExpanded: boolean }>`
  min-height: 40px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid
    ${({ isExpanded, theme }) =>
      isExpanded ? theme.colors.primary : theme.colors.gray300};
  border-radius: 999px;

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  background-color: ${({ isExpanded, theme }) =>
    isExpanded ? theme.colors.gray50 : theme.colors.white};
  color: ${({ isExpanded, theme }) =>
    isExpanded ? theme.colors.primary : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;

  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ToggleIconBox = styled.span`
  width: 18px;
  height: 18px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
`;

const ExpandedContentBox = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const ExpandedHeaderBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const ExpandedTitle = styled.h4`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const ExpandedDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
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
