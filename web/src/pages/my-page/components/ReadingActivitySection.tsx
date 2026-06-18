import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import DottedRankGraph from '@/pages/my-page/components/ReadingActivityStats/DottedRankGraph';
import MonthlyReadingCalendar from '@/pages/my-page/components/ReadingActivityStats/MonthlyReadingCalendar';
import SubscribedCategoryStats from '@/pages/my-page/components/ReadingActivityStats/SubscribedCategoryStats';
import LogoImage from '#/assets/avif/logo.avif';
import CrownIcon from '#/assets/svg/crown.svg';
import StreakIcon from '#/assets/svg/streak.svg';

const RANK_HISTORY = {
  streak: [
    { label: '25.12', rank: 20 },
    { label: '1월', rank: 14 },
    { label: '2월', rank: 20 },
    { label: '3월', rank: 12 },
    { label: '4월', rank: 9 },
    { label: '5월', rank: 3 },
  ],
  reading: [
    { label: '25.12', rank: 20 },
    { label: '1월', rank: 15 },
    { label: '2월', rank: 19 },
    { label: '3월', rank: 10 },
    { label: '4월', rank: 8 },
    { label: '5월', rank: 3 },
  ],
} as const;

const ReadingActivitySection = () => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { data: streakRank, isLoading: isStreakLoading } = useQuery(
    queries.myStreakReadingRank(),
  );
  const { data: readingRank, isLoading: isReadingLoading } = useQuery(
    queries.myMonthlyReadingRank(),
  );

  return (
    <Container>
      <Title>읽기 활동</Title>
      {isMobile && (
        <MobileCompanionCard>
          <MobileCompanionImage src={LogoImage} alt="" />
          <MobileCompanionTextWrapper>
            <MobileCompanionLabel>봄봄과 함께한 지</MobileCompanionLabel>
            <MobileCompanionDays>142일째</MobileCompanionDays>
            <MobileCompanionDescription>
              꾸준한 읽기 습관이 쌓이고 있어요!
            </MobileCompanionDescription>
          </MobileCompanionTextWrapper>
          <MobileCompanionArrow aria-hidden="true">›</MobileCompanionArrow>
        </MobileCompanionCard>
      )}
      <StatsWrapper isMobile={isMobile}>
        <StatCard isMobile={isMobile}>
          <HeaderWrapper>
            <StatTitleWrapper isMobile={isMobile}>
              <StatIcon
                as={StreakIcon}
                aria-hidden="true"
                isMobile={isMobile}
              />
              <StatTitle isMobile={isMobile}>연속왕</StatTitle>
              {streakRank && (
                <StreakSummary isMobile={isMobile}>
                  <Description>연속 읽기</Description>
                  <StreakValue>
                    {streakRank.dayCount}
                    <StreakUnit>일째</StreakUnit>
                  </StreakValue>
                </StreakSummary>
              )}
            </StatTitleWrapper>
          </HeaderWrapper>
          {isStreakLoading || !streakRank ? (
            <LoadingMessage>연속 읽기 순위를 불러오는 중이에요.</LoadingMessage>
          ) : (
            <DottedRankGraph
              points={[...RANK_HISTORY.streak]}
              currentRank={streakRank.rank}
              showYAxis={false}
              showArea
            />
          )}
        </StatCard>

        <StatCard isMobile={isMobile}>
          <HeaderWrapper>
            <StatTitleWrapper isMobile={isMobile}>
              <StatIcon as={CrownIcon} aria-hidden="true" isMobile={isMobile} />
              <StatTitle isMobile={isMobile}>다독왕</StatTitle>
            </StatTitleWrapper>
            {isMobile && readingRank ? (
              <MobileReadingSummary>
                <Description>누적 읽은 아티클</Description>
                <MobileReadingValue>
                  {readingRank.monthlyReadCount}
                  <MobileReadingUnit>개</MobileReadingUnit>
                </MobileReadingValue>
              </MobileReadingSummary>
            ) : (
              <Description>읽은 아티클 수 기준 순위</Description>
            )}
          </HeaderWrapper>
          {isReadingLoading || !readingRank ? (
            <LoadingMessage>읽기 순위를 불러오는 중이에요.</LoadingMessage>
          ) : (
            <>
              <DottedRankGraph
                points={[...RANK_HISTORY.reading]}
                currentRank={readingRank.rank}
              />
            </>
          )}
        </StatCard>

        <SubscribedCategoryStats isMobile={isMobile} />
      </StatsWrapper>

      <MonthlyReportImage
        src="/assets/svg/monthly-reading-report.svg"
        alt="2024년 6월 월간 리포트 예시. 읽은 아티클 248개, 북마크 132개, 월간 읽기 달력과 뉴스레터 카테고리 요약"
      />

      <MonthlyReadingCalendar isMobile={isMobile} />
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
    isMobile
      ? 'repeat(2, minmax(0, 1fr))'
      : 'minmax(0, 1fr) minmax(0, 1fr) minmax(360px, 1.4fr)'};
`;

const StatCard = styled.article<{ isMobile: boolean }>`
  min-width: 0;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const HeaderWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
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
  width: ${({ isMobile }) => (isMobile ? 'calc(100% - 28px)' : 'auto')};
  margin-left: ${({ isMobile }) => (isMobile ? '28px' : 'auto')};

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

const MonthlyReportImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;

  display: block;
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

const MobileCompanionImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 20px;

  flex-shrink: 0;

  object-fit: cover;
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

const MobileCompanionArrow = styled.span`
  margin-left: auto;

  flex-shrink: 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t11Regular};
`;
