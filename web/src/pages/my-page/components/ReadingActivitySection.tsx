import { myPageQueries } from '@bombom/shared/apis/mypage';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import DottedRankGraph from '@/pages/my-page/components/ReadingActivityStats/DottedRankGraph';
import MonthlyReport from '@/pages/my-page/components/ReadingActivityStats/MonthlyReport';
import CrownIcon from '#/assets/svg/crown.svg';
import StreakIcon from '#/assets/svg/streak.svg';

type MobileRankTab = 'reading' | 'streak';

const ReadingActivitySection = () => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const [activeMobileRankTab, setActiveMobileRankTab] =
    useState<MobileRankTab>('reading');
  const { data: rankSummary, isLoading: isRankSummaryLoading } = useQuery(
    queries.rankSummary(),
  );
  const { data: joinDays } = useQuery({
    ...myPageQueries.getMemberJoinDays(),
    enabled: isMobile,
  });
  const streakRank = rankSummary?.cards.find(({ type }) => type === 'streak');
  const readingRank = rankSummary?.cards.find(({ type }) => type === 'reading');
  const streakCurrentRank =
    streakRank?.currentRank ?? streakRank?.rankHistory.at(-1)?.rank;
  const readingCurrentRank =
    readingRank?.currentRank ?? readingRank?.rankHistory.at(-1)?.rank;
  const hasStreakRankHistory = (streakRank?.rankHistory.length ?? 0) > 0;
  const hasReadingRankHistory = (readingRank?.rankHistory.length ?? 0) > 0;

  const streakRankCard = (
    <StatCard key="streak" isMobile={isMobile}>
      {isMobile && streakCurrentRank && (
        <MobileRankBadge>{streakCurrentRank}위</MobileRankBadge>
      )}
      <HeaderWrapper>
        <StatTitleWrapper isMobile={isMobile}>
          <StatIcon as={StreakIcon} aria-hidden="true" isMobile={isMobile} />
          <StatTitle isMobile={isMobile}>연속왕</StatTitle>
          {!isMobile && streakRank && (
            <StreakSummary isMobile={isMobile}>
              <Description>연속 읽기</Description>
              <StreakValue>
                {streakRank.value}
                <StreakUnit>일째</StreakUnit>
              </StreakValue>
            </StreakSummary>
          )}
        </StatTitleWrapper>
        {isMobile && streakRank && (
          <StreakSummary isMobile={isMobile}>
            <Description>연속 읽기</Description>
            <StreakValue>
              {streakRank.value}
              <StreakUnit>일째</StreakUnit>
            </StreakValue>
          </StreakSummary>
        )}
      </HeaderWrapper>
      {isRankSummaryLoading ? (
        <LoadingMessage>연속 읽기 순위를 불러오는 중이에요.</LoadingMessage>
      ) : !streakRank || !streakCurrentRank || !hasStreakRankHistory ? (
        <LoadingMessage>연속 읽기 순위 이력이 없어요.</LoadingMessage>
      ) : (
        <GraphWrapper isMobile={isMobile}>
          <DottedRankGraph
            points={streakRank.rankHistory}
            currentRank={streakCurrentRank}
            showYAxis={false}
            showArea
            showBadge={!isMobile}
            largeXAxisLabel={isMobile}
          />
        </GraphWrapper>
      )}
    </StatCard>
  );

  const readingRankCard = (
    <StatCard key="reading" isMobile={isMobile}>
      {isMobile && readingCurrentRank && (
        <MobileRankBadge>{readingCurrentRank}위</MobileRankBadge>
      )}
      <HeaderWrapper>
        <StatTitleWrapper isMobile={isMobile}>
          <StatIcon as={CrownIcon} aria-hidden="true" isMobile={isMobile} />
          <StatTitle isMobile={isMobile}>다독왕</StatTitle>
        </StatTitleWrapper>
        {isMobile && readingRank ? (
          <MobileReadingSummary>
            <Description>누적 읽은 아티클</Description>
            <MobileReadingValue>
              {readingRank.value}
              <MobileReadingUnit>개</MobileReadingUnit>
            </MobileReadingValue>
          </MobileReadingSummary>
        ) : (
          <Description>읽은 아티클 수 기준 순위</Description>
        )}
      </HeaderWrapper>
      {isRankSummaryLoading ? (
        <LoadingMessage>읽기 순위를 불러오는 중이에요.</LoadingMessage>
      ) : !readingRank || !readingCurrentRank || !hasReadingRankHistory ? (
        <LoadingMessage>읽기 순위 이력이 없어요.</LoadingMessage>
      ) : (
        <GraphWrapper isMobile={isMobile}>
          <DottedRankGraph
            points={readingRank.rankHistory}
            currentRank={readingCurrentRank}
            showYAxis={!isMobile}
            showArea={isMobile}
            showBadge={!isMobile}
            largeXAxisLabel={isMobile}
          />
        </GraphWrapper>
      )}
    </StatCard>
  );

  return (
    <Container>
      <Title>읽기 활동</Title>
      {isMobile && joinDays && (
        <MobileCompanionCard>
          <MobileCompanionHeart viewBox="104 47 52 42" aria-hidden="true">
            <defs>
              <linearGradient
                id="mobile-companion-heart"
                x1="104"
                y1="48"
                x2="144"
                y2="88"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFB4C3" />
                <stop offset="1" stopColor="#FF4E6E" />
              </linearGradient>
            </defs>
            <path
              d="M130 88C121 83 105 74 105 62C105 54 111 48 119 48C123 48 127 50 130 54C133 50 137 48 141 48C149 48 155 54 155 62C155 74 139 83 130 88Z"
              fill="url(#mobile-companion-heart)"
              stroke="#FF3F62"
              strokeWidth="2"
            />
          </MobileCompanionHeart>
          <MobileCompanionTextWrapper>
            <MobileCompanionLabel>봄봄과 함께한 지</MobileCompanionLabel>
            <MobileCompanionDays>
              {joinDays.daysSinceJoined}일째
            </MobileCompanionDays>
            <MobileCompanionDescription>
              꾸준한 읽기 습관이 쌓이고 있어요!
            </MobileCompanionDescription>
          </MobileCompanionTextWrapper>
        </MobileCompanionCard>
      )}
      {isMobile && (
        <MobileRankTabWrapper role="tablist" aria-label="읽기 활동 랭킹">
          <MobileRankTabButton
            type="button"
            role="tab"
            aria-selected={activeMobileRankTab === 'reading'}
            $active={activeMobileRankTab === 'reading'}
            onClick={() => setActiveMobileRankTab('reading')}
          >
            다독왕
          </MobileRankTabButton>
          <MobileRankTabButton
            type="button"
            role="tab"
            aria-selected={activeMobileRankTab === 'streak'}
            $active={activeMobileRankTab === 'streak'}
            onClick={() => setActiveMobileRankTab('streak')}
          >
            연속왕
          </MobileRankTabButton>
        </MobileRankTabWrapper>
      )}
      <StatsWrapper isMobile={isMobile}>
        {isMobile
          ? activeMobileRankTab === 'reading'
            ? readingRankCard
            : streakRankCard
          : [streakRankCard, readingRankCard]}
      </StatsWrapper>

      <MonthlyReport isMobile={isMobile} />
    </Container>
  );
};

export default ReadingActivitySection;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const StatsWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: grid;
  gap: 16px;

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) minmax(0, 1fr)'};
`;

const MobileRankTabWrapper = styled.div`
  width: 100%;
  padding: 3px;
  border-radius: 999px;

  display: grid;

  background-color: ${({ theme }) => theme.colors.disabledBackground};

  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const MobileRankTabButton = styled.button<{ $active: boolean }>`
  height: 40px;
  min-width: 0;
  border: ${({ $active, theme }) =>
    $active ? `1px solid ${theme.colors.stroke}` : '1px solid transparent'};
  border-radius: 999px;
  box-shadow: ${({ $active }) =>
    $active ? '0 2px 8px rgb(0 0 0 / 8%)' : 'none'};

  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.white : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Bold};

  cursor: pointer;
`;

const StatCard = styled.article<{ isMobile: boolean }>`
  position: relative;
  min-width: 0;
  padding: ${({ isMobile }) => (isMobile ? '22px 18px' : '20px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: ${({ isMobile }) => (isMobile ? 'grid' : 'flex')};
  gap: 16px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? 'minmax(96px, 0.32fr) minmax(0, 1fr)' : 'none'};
`;

const HeaderWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const GraphWrapper = styled.div<{ isMobile: boolean }>`
  min-width: 0;
  margin-top: ${({ isMobile }) => (isMobile ? '26px' : '0')};
`;

const MobileRankBadge = styled.strong`
  position: absolute;
  top: 24px;
  right: 22px;
  padding: 4px 14px;
  border-radius: 999px;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const StatTitleWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 8px;
  flex-wrap: ${({ isMobile }) => (isMobile ? 'wrap' : 'nowrap')};
  align-items: center;
`;

const StatIcon = styled.svg<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '20px' : '28px')};
  height: ${({ isMobile }) => (isMobile ? '20px' : '28px')};

  flex-shrink: 0;

  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const StatTitle = styled.h3<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Bold : theme.fonts.t8Bold};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const StreakSummary = styled.div<{ isMobile: boolean }>`
  width: auto;
  margin-left: ${({ isMobile }) => (isMobile ? '0' : 'auto')};

  display: flex;
  gap: 4px;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'baseline')};
`;

const StreakValue = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const StreakUnit = styled.span`
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const MobileReadingSummary = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const MobileReadingValue = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const MobileReadingUnit = styled.span`
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const LoadingMessage = styled.p`
  margin: auto;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const MobileCompanionCard = styled.article`
  width: 100%;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 20px;
  box-shadow: 0 8px 20px rgb(254 94 4 / 10%);

  display: flex;
  gap: 16px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const MobileCompanionHeart = styled.svg`
  width: 72px;
  height: 72px;

  display: block;
  flex-shrink: 0;
`;

const MobileCompanionTextWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const MobileCompanionLabel = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const MobileCompanionDays = styled.strong`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const MobileCompanionDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;
