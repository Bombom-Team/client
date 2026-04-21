import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';
import type { Badges, MonthlyReadingBadgeGrade } from '../../types/badges';

const BADGE_RANKING_IMAGE_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '/assets/png/ranking_gold.png',
  SILVER: '/assets/png/ranking_silver.png',
  BRONZE: '/assets/png/ranking_bronze.png',
};

const BADGE_RANKING_LABEL_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '1등',
  SILVER: '2등',
  BRONZE: '3등',
};

interface UserBadgeInfoProps {
  badges?: Badges;
}

const RankingBadgeInfo = ({ badges }: UserBadgeInfoProps) => {
  const [rankingTooltipOpened, setRankingTooltipOpened] = useState(false);
  const rankingBadgeRef = useRef<HTMLDivElement>(null);

  const rankingBadgeSrc = badges?.monthlyRanking
    ? BADGE_RANKING_IMAGE_MAP[badges.monthlyRanking.grade]
    : null;

  const rankingTooltipText = badges?.monthlyRanking
    ? `${badges.monthlyRanking.month}월 독서왕 ${
        BADGE_RANKING_LABEL_MAP[badges.monthlyRanking.grade]
      }`
    : '';

  const openRankingTooltip = () => setRankingTooltipOpened(true);
  const closeRankingTooltip = () => setRankingTooltipOpened(false);

  return (
    <>
      {rankingBadgeSrc && badges?.monthlyRanking && (
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
            alt={`${badges.monthlyRanking.year}년 ${badges.monthlyRanking.month}월 랭킹 ${badges.monthlyRanking.grade}`}
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
    </>
  );
};

const BadgeItem = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.base};

  display: flex;
  align-items: center;
`;

const Badge = styled.img`
  width: 36px;
  height: 36px;
`;

export default RankingBadgeInfo;
