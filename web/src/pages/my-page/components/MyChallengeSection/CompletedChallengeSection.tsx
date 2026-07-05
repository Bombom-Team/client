import styled from '@emotion/styled';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import ChallengeEmptyState from './ChallengeEmptyState';
import CompletedChallengeCard from './CompletedChallengeCard';
import { queries } from '@/apis/queries';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const PAGE_SIZE: Record<Device, number> = {
  pc: 6,
  mobile: 4,
  tablet: 4,
};

const CompletedChallengeSection = () => {
  const device = useDevice();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      queries.infiniteMyCompletedChallenges({ size: PAGE_SIZE[device] }),
    );

  const completed = data.pages.flatMap((page) => page?.content ?? []);

  if (completed.length === 0) {
    return (
      <ChallengeEmptyState
        emoji="🏆"
        title="아직 완료한 챌린지가 없어요"
        description="챌린지를 완료하면 이곳에 기록이 쌓여요."
        showGoToChallengeButton={false}
      />
    );
  }

  return (
    <Container>
      <CompletedGrid device={device}>
        {completed.map((challenge) => (
          <CompletedChallengeCard
            key={challenge.challengeId}
            challenge={challenge}
          />
        ))}
      </CompletedGrid>
      {hasNextPage && (
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          <ChevronIcon direction="down" width={20} height={20} />
        </LoadMoreButton>
      )}
    </Container>
  );
};

export default CompletedChallengeSection;

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const CompletedGrid = styled.div<{ device: Device }>`
  display: grid;
  gap: 12px;

  grid-template-columns: ${({ device }) =>
    device === 'pc' ? 'repeat(2, 1fr)' : '1fr'};
`;

const LoadMoreButton = styled.button`
  width: fit-content;
  padding: 12px;
  border: none;

  display: flex;
  gap: 4px;
  align-items: center;
  align-self: center;
  justify-content: center;

  background: none;
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t6Regular};

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;
