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

type RankingTab = 'monthly' | 'streak';

const ReadingKingLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<RankingTab>('monthly');
  const [rankExplainOpened, setRankExplainOpened] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);

  const {
    data: monthlyReadingRank,
    isLoading: isMonthlyLoading,
    isFetching: isMonthlyFetching,
    refetch: refetchMonthlyReadingRank,
  } = useQuery(queries.monthlyReadingRank({ limit: RANKING.maxRank }));
  const { data: userRank, refetch: refetchMyMonthlyReadingRank } = useQuery(
    queries.myMonthlyReadingRank(),
  );

  const {
    data: streakReadingRank,
    isLoading: isStreakLoading,
    isFetching: isStreakFetching,
  } = useQuery(queries.streakReadingRank({ limit: RANKING.maxRank }));

  const isLoading =
    activeTab === 'monthly' ? isMonthlyLoading : isStreakLoading;
  const isFetching =
    activeTab === 'monthly' ? isMonthlyFetching : isStreakFetching;

  const { leftTime, isCompleting } = useCountdown({
    targetTime:
      (activeTab === 'monthly'
        ? monthlyReadingRank?.nextRefreshAt
        : streakReadingRank?.nextRefreshAt) ??
      new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString(),
    completeDelay: 2000,
    onComplete: () => {
      refetchMonthlyReadingRank();
      refetchMyMonthlyReadingRank();
    },
  });

  const openRankExplain = () => setRankExplainOpened(true);
  const closeRankExplain = () => setRankExplainOpened(false);

  const monthlyContent = monthlyReadingRank?.data ?? [];
  const streakContent = streakReadingRank?.data ?? [];
  const haveNoContent =
    activeTab === 'monthly'
      ? !isMonthlyLoading && monthlyContent.length === 0
      : !isStreakLoading && streakContent.length === 0;

  const tabLabel = activeTab === 'monthly' ? '이달의 독서왕' : '연속 독서왕';

  if (
    !isMonthlyLoading &&
    !isStreakLoading &&
    monthlyContent.length === 0 &&
    streakContent.length === 0
  )
    return null;
  if (isLoading) return <ReadingKingLeaderboardSkeleton />;

  return (
    <Container>
      <TitleWrapper>
        <TitleIcon aria-hidden="true">
          <ArrowIcon width={16} height={16} direction="upRight" />
        </TitleIcon>
        <TabToggle role="tablist" aria-label="독서왕 랭킹 유형 선택">
          <TabButton
            role="tab"
            aria-selected={activeTab === 'monthly'}
            $active={activeTab === 'monthly'}
            onClick={() => setActiveTab('monthly')}
          >
            이달의 독서왕
          </TabButton>
          <TabButton
            role="tab"
            aria-selected={activeTab === 'streak'}
            $active={activeTab === 'streak'}
            onClick={() => setActiveTab('streak')}
          >
            연속 독서왕
          </TabButton>
        </TabToggle>
        {activeTab === 'monthly' && (
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
        )}
      </TitleWrapper>

      {haveNoContent ? null : activeTab === 'monthly' ? (
        <Carousel.Root loop key="monthly">
          <Carousel.Slides>
            {chunk(monthlyContent, RANKING.boardUnit).map(
              (leaderboard, leaderboardIndex) => (
                <Carousel.Slide key={`slide-${leaderboardIndex}`}>
                  <LeaderboardList
                    role="list"
                    aria-label={`${tabLabel} 순위 ${leaderboardIndex + 1}페이지`}
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
      ) : (
        <Carousel.Root loop key="streak">
          <Carousel.Slides>
            {chunk(streakContent, RANKING.boardUnit).map(
              (leaderboard, leaderboardIndex) => (
                <Carousel.Slide key={`slide-${leaderboardIndex}`}>
                  <LeaderboardList
                    role="list"
                    aria-label={`${tabLabel} 순위 ${leaderboardIndex + 1}페이지`}
                  >
                    {leaderboard.map((item, index) => (
                      <LeaderboardItem
                        key={`rank-${index}` + item.nickname}
                        rank={item.rank}
                        name={item.nickname}
                        readCount={item.streakDays}
                        readCountLabel="일 연속"
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
      )}

      {activeTab === 'monthly' && userRank && (
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
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 20px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 10%);

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(10px);
`;

export const TitleWrapper = styled.div`
  position: relative;
  width: fit-content;

  display: flex;
  gap: 10px;
  align-items: center;
`;

export const TitleIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const TabToggle = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border: none;
  border-radius: 6px;

  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};

  background-color: ${({ $active }) => ($active ? '#fff' : 'transparent')};

  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
`;

export const CountdownWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const Countdown = styled.div`
  position: relative;
  width: 36px;

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

  width: 36px;

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
  gap: 32px;
  flex-direction: column;
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};
`;
