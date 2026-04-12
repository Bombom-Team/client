import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import LeaderboardItem from './LeaderboardItem';
import { RANKING } from './ReadingKingLeaderboard.constants';
import ReadingKingLeaderboardSkeleton from './ReadingKingLeaderboardSkeleton';
import ReadingKingMyRank from './ReadingKingMyRank';
import { queries } from '@/apis/queries';
import { Carousel } from '@/components/Carousel/Carousel';
import ArrowIcon from '@/components/icons/ArrowIcon';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useCountdown } from '@/hooks/useCountdown';
import { chunk } from '@/utils/array';
import { padTimeDigit } from '@/utils/time';

const COUNTDOWN_UPDATE_INTERVAL_MS = 1000 * 60 * 10;

const ReadingKingLeaderboard = () => {
  const [rankExplainOpened, setRankExplainOpened] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);

  const {
    data: monthlyReadingRank,
    isLoading,
    isFetching,
    refetch: refetchMonthlyReadingRank,
  } = useQuery(queries.monthlyReadingRank({ limit: RANKING.maxRank }));
  const { data: userRank, refetch: refetchMyMonthlyReadingRank } = useQuery(
    queries.myMonthlyReadingRank(),
  );

  const { leftTime, isCompleting } = useCountdown({
    targetTime:
      monthlyReadingRank?.nextRefreshAt ??
      new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString(),
    completeDelay: 2000,
    onComplete: () => {
      refetchMonthlyReadingRank();
      refetchMyMonthlyReadingRank();
    },
  });

  const openRankExplain = () => setRankExplainOpened(true);
  const closeRankExplain = () => setRankExplainOpened(false);

  const monthlyReadingRankContent = monthlyReadingRank?.data ?? [];
  const haveNoContent = !isLoading && monthlyReadingRankContent.length === 0;

  if (!isLoading && haveNoContent) return null;
  if (isLoading) return <ReadingKingLeaderboardSkeleton />;

  return (
    <Container>
      <TitleWrapper>
        <TitleIcon aria-hidden="true">
          <ArrowIcon width={16} height={16} direction="upRight" />
        </TitleIcon>
        <Title>이달의 독서왕</Title>
        <CountdownWrapper>
          <Countdown
            ref={countdownRef}
            onMouseEnter={openRankExplain}
            onMouseLeave={closeRankExplain}
            onFocus={openRankExplain}
            onBlur={closeRankExplain}
          >
            {`${padTimeDigit(leftTime.minutes)}:${padTimeDigit(leftTime.seconds)}`}
            <Tooltip
              opened={rankExplainOpened}
              placement="bottom"
              anchorRef={countdownRef}
            >
              순위는 10분마다 갱신됩니다.
            </Tooltip>
          </Countdown>
          {(isFetching || isCompleting) && <CountdownLoadingDots />}
        </CountdownWrapper>
      </TitleWrapper>

      <Carousel.Root loop>
        <Carousel.Slides>
          {chunk(monthlyReadingRankContent, RANKING.boardUnit).map(
            (leaderboard, leaderboardIndex) => (
              <Carousel.Slide key={`slide-${leaderboardIndex}`}>
                <LeaderboardList
                  role="list"
                  aria-label={`이달의 독서왕 순위 ${leaderboardIndex + 1}페이지`}
                >
                  {leaderboard.map((item, index) => (
                    <LeaderboardItem
                      key={`rank-${index}` + item.nickname}
                      rank={item.rank}
                      name={item.nickname}
                      readCount={item.monthlyReadCount}
                      badges={item.badges}
                    />
                  ))}
                </LeaderboardList>
              </Carousel.Slide>
            ),
          )}
        </Carousel.Slides>
        <Carousel.NavButtons position="bottom" />
      </Carousel.Root>

      {userRank && (
        <>
          <Divider role="separator" aria-hidden="true" />
          <ReadingKingMyRank userRank={userRank} />
        </>
      )}
    </Container>
  );
};

export default ReadingKingLeaderboard;

export const Container = styled.section`
  width: 100%;
  max-width: 400px;
  padding: 1.375rem;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 1.25rem;
  box-shadow:
    0 0.625rem 0.9375rem -0.1875rem rgb(0 0 0 / 10%),
    0 0.25rem 0.375rem -0.25rem rgb(0 0 0 / 10%);

  display: flex;
  gap: 1rem;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(0.625rem);
`;

export const TitleWrapper = styled.div`
  position: relative;
  width: fit-content;

  display: flex;
  gap: 0.625rem;
  align-items: center;
`;

export const TitleIcon = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

export const CountdownWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const Countdown = styled.div`
  position: relative;
  width: 2.25rem;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};

  cursor: help;
`;

const CountdownLoadingDots = styled.div`
  --dot-gradient: no-repeat
    radial-gradient(
      circle closest-side,
      ${({ theme }) => theme.colors.primaryDark} 70%,
      #0000
    );

  width: 2.25rem;

  background:
    var(--dot-gradient) 0% 50%,
    var(--dot-gradient) 50% 50%,
    var(--dot-gradient) 100% 50%;
  background-size: calc(100% / 3) 100%;

  animation: l7 1s infinite linear;

  aspect-ratio: 4;

  @keyframes l7 {
    33% {
      background-size:
        calc(100% / 3) 0%,
        calc(100% / 3) 100%,
        calc(100% / 3) 100%;
    }

    50% {
      background-size:
        calc(100% / 3) 100%,
        calc(100% / 3) 0%,
        calc(100% / 3) 100%;
    }

    66% {
      background-size:
        calc(100% / 3) 100%,
        calc(100% / 3) 100%,
        calc(100% / 3) 0%;
    }
  }
`;

export const LeaderboardList = styled.div`
  min-height: fit-content;

  display: flex;
  gap: 2rem;
  flex-direction: column;
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};
`;
