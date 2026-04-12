import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';
import type { Badges, MonthlyReadingBadgeGrade } from '../../types/badges';

const BADGE_CHALLENGE_IMAGE_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '/assets/avif/challenge-gold-medal.avif',
  SILVER: '/assets/avif/challenge-silver-medal.avif',
  BRONZE: '/assets/avif/challenge-bronze-medal.avif',
};

interface UserBadgeInfoProps {
  badges?: Badges;
}

const ChallengeBadgeInfo = ({ badges }: UserBadgeInfoProps) => {
  const [challengeTooltipOpened, setChallengeTooltipOpened] = useState(false);

  const challengeBadgeRef = useRef<HTMLDivElement>(null);

  const challengeBadgeSrc = badges?.challenge
    ? BADGE_CHALLENGE_IMAGE_MAP[badges.challenge.grade]
    : null;

  const challengeTooltipText = badges?.challenge?.name
    ? `${badges.challenge.name} ${badges.challenge.generation}기`
    : '';

  const openChallengeTooltip = () => setChallengeTooltipOpened(true);
  const closeChallengeTooltip = () => setChallengeTooltipOpened(false);

  return (
    <>
      {challengeBadgeSrc && badges?.challenge && (
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
            alt={`${badges.challenge.name} ${badges.challenge.generation}기 ${badges.challenge.grade}`}
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

export default ChallengeBadgeInfo;
