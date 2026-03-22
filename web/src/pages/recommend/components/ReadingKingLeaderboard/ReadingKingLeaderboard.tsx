import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import MonthlyRankingContent from './MonthlyRankingContent';
import {
  COUNTDOWN_UPDATE_INTERVAL_MS,
  RANKING,
} from './ReadingKingLeaderboard.constants';
import {
  Container,
  TitleWrapper,
  TitleIcon,
  TabToggle,
  TabButton,
  CountdownWrapper,
  Countdown,
  CountdownLoadingDots,
} from './ReadingKingLeaderboard.styles';
import StreakRankingContent from './StreakRankingContent';
import { queries } from '@/apis/queries';
import ArrowIcon from '@/components/icons/ArrowIcon';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useCountdown } from '@/hooks/useCountdown';
import { padTimeDigit } from '@/utils/time';

type RankingTab = 'monthly' | 'streak';

const ReadingKingLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<RankingTab>('monthly');
  const [rankExplainOpened, setRankExplainOpened] = useState(false);
  const [nextRefreshAt, setNextRefreshAt] = useState<string>(
    new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString(),
  );
  const [isFetching, setIsFetching] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const isMonthlyTab = activeTab === 'monthly';

  const handleCountdownStateChange = useCallback(
    (state: { nextRefreshAt: string; isFetching: boolean }) => {
      setNextRefreshAt(state.nextRefreshAt);
      setIsFetching(state.isFetching);
    },
    [],
  );

  const { leftTime, isCompleting } = useCountdown({
    targetTime: nextRefreshAt,
    completeDelay: 2000,
    onComplete: () => {
      queryClient.invalidateQueries({
        queryKey: queries.monthlyReadingRank({ limit: RANKING.maxRank })
          .queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.myMonthlyReadingRank().queryKey,
      });
    },
  });

  const openRankExplain = () => setRankExplainOpened(true);
  const closeRankExplain = () => setRankExplainOpened(false);

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
            active={activeTab === 'monthly'}
            onClick={() => setActiveTab('monthly')}
          >
            이달의 독서왕
          </TabButton>
          <TabButton
            role="tab"
            aria-selected={activeTab === 'streak'}
            active={activeTab === 'streak'}
            onClick={() => setActiveTab('streak')}
          >
            연속 독서왕
          </TabButton>
        </TabToggle>
        {isMonthlyTab && (
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

      {isMonthlyTab ? (
        <MonthlyRankingContent
          onCountdownStateChange={handleCountdownStateChange}
        />
      ) : (
        <StreakRankingContent />
      )}
    </Container>
  );
};

export default ReadingKingLeaderboard;
