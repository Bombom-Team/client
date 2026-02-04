import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Tooltip from '@/components/Tooltip/Tooltip';
import { calculateRate } from '@/utils/math';
import type { MonthlyReadingBadgeGrade } from '../../types/badges';
import type { components } from '@/types/openapi';

const BADGE_RANKING_IMAGE_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '/assets/png/ranking_gold.png',
  SILVER: '/assets/png/ranking_silver.png',
  BRONZE: '/assets/png/ranking_bronze.png',
};

const BADGE_CHALLENGE_IMAGE_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '/assets/avif/challenge-gold-medal.avif',
  SILVER: '/assets/avif/challenge-silver-medal.avif',
  BRONZE: '/assets/avif/challenge-bronze-medal.avif',
};

const BADGE_RANKING_LABEL_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '1등',
  SILVER: '2등',
  BRONZE: '3등',
};

interface ReadingKingMyRankProps {
  userRank: components['schemas']['MemberMonthlyReadingRankResponse'];
}

const ReadingKingMyRank = ({ userRank }: ReadingKingMyRankProps) => {
  const [rankingTooltipOpened, setRankingTooltipOpened] = useState(false);
  const [challengeTooltipOpened, setChallengeTooltipOpened] = useState(false);
  const rankingBadgeRef = useRef<HTMLDivElement>(null);
  const challengeBadgeRef = useRef<HTMLDivElement>(null);

  const progressRate = calculateRate(
    userRank.monthlyReadCount,
    userRank.monthlyReadCount + userRank.nextRankDifference,
  );
  const rankingBadgeSrc = userRank.badges?.ranking
    ? BADGE_RANKING_IMAGE_MAP[userRank.badges.ranking.grade]
    : null;
  const challengeBadgeSrc = userRank.badges?.challenge
    ? BADGE_CHALLENGE_IMAGE_MAP[userRank.badges.challenge.grade]
    : null;
  const rankingTooltipText = userRank.badges?.ranking
    ? `${userRank.badges.ranking.month}월 독서왕 ${
        BADGE_RANKING_LABEL_MAP[userRank.badges.ranking.grade]
      }`
    : '';
  const challengeTooltipText = userRank.badges?.challenge?.name
    ? `${userRank.badges.challenge.name} ${userRank.badges.challenge.generation}기`
    : '';

  const rankSummary = `현재 나의 순위 ${userRank.rank}위. 읽은 뉴스레터 ${userRank.monthlyReadCount}개. 다음 순위까지 ${userRank.nextRankDifference}개 더 읽기. 진행률 ${progressRate}%`;
  const openRankingTooltip = () => setRankingTooltipOpened(true);
  const closeRankingTooltip = () => setRankingTooltipOpened(false);
  const openChallengeTooltip = () => setChallengeTooltipOpened(true);
  const closeChallengeTooltip = () => setChallengeTooltipOpened(false);

  return (
    <Container aria-label={rankSummary} tabIndex={0}>
      <MyRankInfo>
        <InfoWrapper>
          <NameWrapper>
            <MyRankLabel>{userRank.nickname}</MyRankLabel>
            <BadgeWrapper>
              {rankingBadgeSrc && userRank.badges?.ranking && (
                <BadgeItem
                  tabIndex={0}
                  ref={rankingBadgeRef}
                  onMouseEnter={openRankingTooltip}
                  onMouseLeave={closeRankingTooltip}
                  onFocus={openRankingTooltip}
                  onBlur={closeRankingTooltip}
                >
                  <Badge
                    src={rankingBadgeSrc}
                    alt={`${userRank.badges.ranking.year}년 ${userRank.badges.ranking.month}월 랭킹 ${userRank.badges.ranking.grade}`}
                    loading="lazy"
                  />
                  <Tooltip
                    opened={rankingTooltipOpened}
                    placement="top"
                    anchorRef={rankingBadgeRef}
                  >
                    {rankingTooltipText}
                  </Tooltip>
                </BadgeItem>
              )}
              {challengeBadgeSrc && userRank.badges?.challenge && (
                <BadgeItem
                  tabIndex={0}
                  ref={challengeBadgeRef}
                  onMouseEnter={openChallengeTooltip}
                  onMouseLeave={closeChallengeTooltip}
                  onFocus={openChallengeTooltip}
                  onBlur={closeChallengeTooltip}
                >
                  <Badge
                    src={challengeBadgeSrc}
                    alt={`${userRank.badges.challenge.name} ${userRank.badges.challenge.generation}기 ${userRank.badges.challenge.grade}`}
                    loading="lazy"
                  />
                  <Tooltip
                    opened={challengeTooltipOpened}
                    placement="top"
                    anchorRef={challengeBadgeRef}
                  >
                    {challengeTooltipText}
                  </Tooltip>
                </BadgeItem>
              )}
            </BadgeWrapper>
          </NameWrapper>
          <MyRankLabel>읽은 뉴스레터</MyRankLabel>
        </InfoWrapper>
        <InfoWrapper>
          <MyRankValue>{userRank.rank}위</MyRankValue>
          <MyReadValue>{userRank.monthlyReadCount}개</MyReadValue>
        </InfoWrapper>
      </MyRankInfo>

      <ProgressBox>
        <InfoWrapper>
          <ProgressLabel>다음 순위까지</ProgressLabel>
          <ProgressLabel>{userRank.nextRankDifference}개 더 읽기</ProgressLabel>
        </InfoWrapper>
        <ProgressBar rate={progressRate} />
      </ProgressBox>
    </Container>
  );
};

export default ReadingKingMyRank;

const Container = styled.section`
  padding: 16px;
  border-radius: 16px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background-color: ${({ theme }) => `${theme.colors.primary}10`};
`;

const MyRankInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const BadgeWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const NameWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const BadgeItem = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.base};

  display: flex;
  align-items: center;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MyRankLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const MyRankValue = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const MyReadValue = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const ProgressBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const ProgressLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const Badge = styled.img`
  width: 36px;
  height: 36px;
`;
