import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
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

const ReadingKingLeaderboard = () => {
  const [rankExplainOpened, setRankExplainOpened] = useState(false);

  const {
    data: monthlyReadingRank,
    isLoading,
    refetch,
  } = useQuery(queries.monthlyReadingRank({ limit: RANKING.maxRank }));
  const { data: userRank } = useQuery(queries.myMonthlyReadingRank());

  const { leftTime } = useCountdown({
    targetTime: monthlyReadingRank?.nextRefreshAt ?? new Date().toISOString(),
    initialTime: monthlyReadingRank?.serverTime,
    completeDelay: 1000,
    onComplete: () => {
      refetch();
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
        <CountDown
          onMouseEnter={openRankExplain}
          onMouseLeave={closeRankExplain}
          onFocus={openRankExplain}
          onBlur={closeRankExplain}
        >
          {`${padTimeDigit(leftTime.minutes)}:${padTimeDigit(leftTime.seconds)}`}
          <Tooltip opened={rankExplainOpened} position="bottom">
            순위는 10분마다 갱신됩니다
          </Tooltip>
        </CountDown>
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

export const CountDown = styled.p`
  position: relative;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};

  cursor: help;
`;

export const TooltipButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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
