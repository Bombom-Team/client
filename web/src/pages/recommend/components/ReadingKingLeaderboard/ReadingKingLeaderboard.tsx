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
  InfoIcon,
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
import HelpIcon from '#/assets/svg/help.svg';

type RankingTab = 'monthly' | 'streak';

const ReadingKingLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<RankingTab>('monthly');
  const [rankExplainOpened, setRankExplainOpened] = useState(false);
  const [streakInfoOpened, setStreakInfoOpened] = useState(false);
  const [nextRefreshAt, setNextRefreshAt] = useState<string>(
    new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString(),
  );
  const [isFetching, setIsFetching] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);
  const streakInfoRef = useRef<HTMLDivElement>(null);
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
  const openStreakInfo = () => setStreakInfoOpened(true);
  const closeStreakInfo = () => setStreakInfoOpened(false);

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
        {isMonthlyTab ? (
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
        ) : (
          <InfoIcon
            ref={streakInfoRef}
            onMouseEnter={openStreakInfo}
            onMouseLeave={closeStreakInfo}
            onFocus={openStreakInfo}
            onBlur={closeStreakInfo}
            tabIndex={0}
            aria-label="연속 독서왕 순위 안내"
          >
            <HelpIcon width={20} height={20} />
            <Tooltip
              opened={streakInfoOpened}
              placement="bottom"
              anchorRef={streakInfoRef}
            >
              매일 자정에 업데이트됩니다.
            </Tooltip>
          </InfoIcon>
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
