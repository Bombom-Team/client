import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';
import type { Badges, StreakBadgeTier } from '../../types/badges';

const STREAK_BADGE_IMAGE_MAP: Record<StreakBadgeTier, string> = {
  SEVEN: '/assets/png/streak-badge-7.png',
  FIFTEEN: '/assets/png/streak-badge-15.png',
  THIRTY: '/assets/png/streak-badge-30.png',
  FIFTY: '/assets/png/streak-badge-50.png',
  HUNDRED: '/assets/png/streak-badge-100.png',
  TWO_HUNDRED: '/assets/png/streak-badge-200.png',
  THREE_HUNDRED: '/assets/png/streak-badge-300.png',
  FOUR_HUNDRED: '/assets/png/streak-badge-400.png',
  FIVE_HUNDRED: '/assets/png/streak-badge-500.png',
};

const STREAK_BADGE_LABEL_MAP: Record<StreakBadgeTier, string> = {
  SEVEN: '7일',
  FIFTEEN: '15일',
  THIRTY: '30일',
  FIFTY: '50일',
  HUNDRED: '100일',
  TWO_HUNDRED: '200일',
  THREE_HUNDRED: '300일',
  FOUR_HUNDRED: '400일',
  FIVE_HUNDRED: '500일',
};

interface StreakBadgeInfoProps {
  badges?: Badges;
}

const StreakBadgeInfo = ({ badges }: StreakBadgeInfoProps) => {
  const [tooltipOpened, setTooltipOpened] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const streakBadgeSrc = badges?.streak
    ? STREAK_BADGE_IMAGE_MAP[badges.streak.tier]
    : null;

  const tooltipText = badges?.streak
    ? `${STREAK_BADGE_LABEL_MAP[badges.streak.tier]} 연속 읽기`
    : '';

  const openTooltip = () => setTooltipOpened(true);
  const closeTooltip = () => setTooltipOpened(false);

  return (
    <>
      {streakBadgeSrc && badges?.streak && (
        <BadgeItem
          tabIndex={0}
          ref={badgeRef}
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
          onFocus={openTooltip}
          onBlur={closeTooltip}
        >
          <Badge
            src={streakBadgeSrc}
            alt={`${STREAK_BADGE_LABEL_MAP[badges.streak.tier]} 연속 읽기 뱃지`}
            loading="lazy"
          />
          <Tooltip opened={tooltipOpened} placement="top" anchorRef={badgeRef}>
            {tooltipText}
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

export default StreakBadgeInfo;
