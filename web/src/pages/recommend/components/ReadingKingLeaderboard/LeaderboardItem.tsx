import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';
import type { Badges, MonthlyReadingBadgeGrade } from '../../types/badges';

const RANK_ICON_MAP: Record<number, string> = {
  1: '👑',
  2: '🥈',
  3: '🥉',
};

const BADGE_RANKING_LABEL_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  GOLD: '1등',
  SILVER: '2등',
  BRONZE: '3등',
};

interface LeaderboardItemProps {
  rank: number;
  name: string;
  readCount: number;
  badges?: Badges;
}

const LeaderboardItem = ({
  rank,
  name,
  readCount,
  badges,
}: LeaderboardItemProps) => {
  const [rankingTooltipOpened, setRankingTooltipOpened] = useState(false);
  const [challengeTooltipOpened, setChallengeTooltipOpened] = useState(false);
  const rankingBadgeRef = useRef<HTMLDivElement>(null);
  const challengeBadgeRef = useRef<HTMLDivElement>(null);

  const rankingBadgeSrc = badges?.ranking
    ? `/assets/png/ranking_${badges.ranking.grade}.png`
    : null;
  const challengeBadgeSrc = badges?.challenge
    ? `/assets/png/challenge_${badges.challenge.generation}_${badges.challenge.grade}.png`
    : null;
  const rankingTooltipText = badges?.ranking
    ? `${badges.ranking.month}월 독서왕 ${
        BADGE_RANKING_LABEL_MAP[badges.ranking.grade]
      }`
    : '';
  const challengeTooltipText = badges?.challenge?.name
    ? `${badges.challenge.name} ${badges.challenge.generation}기`
    : '';

  const openRankingTooltip = () => setRankingTooltipOpened(true);
  const closeRankingTooltip = () => setRankingTooltipOpened(false);

  const openChallengeTooltip = () => setChallengeTooltipOpened(true);
  const closeChallengeTooltip = () => setChallengeTooltipOpened(false);

  return (
    <Container
      role="listitem"
      tabIndex={0}
      aria-label={`${rank}위: ${name}, ${readCount}개 읽음`}
    >
      <ContentWrapper>
        <RankIconWrapper aria-hidden="true">
          {RANK_ICON_MAP[rank] ?? `#${rank}`}
        </RankIconWrapper>

        <UserInfoBox aria-hidden="true">
          <UserName>{name}</UserName>
          <ReadCount>{readCount}개 읽음</ReadCount>
        </UserInfoBox>
      </ContentWrapper>

      <BadgeWrapper>
        {rankingBadgeSrc && badges?.ranking && (
          <BadgeItem
            tabIndex={0}
            ref={rankingBadgeRef}
            onMouseEnter={openRankingTooltip}
            onMouseLeave={closeRankingTooltip}
            onFocus={() => {
              openRankingTooltip();
            }}
            onBlur={closeRankingTooltip}
          >
            <Badge
              src={rankingBadgeSrc}
              alt={`${badges.ranking.year}년 ${badges.ranking.month}월 랭킹 ${badges.ranking.grade}`}
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
        {challengeBadgeSrc && badges?.challenge && (
          <BadgeItem
            tabIndex={0}
            ref={challengeBadgeRef}
            onMouseEnter={openChallengeTooltip}
            onMouseLeave={closeChallengeTooltip}
            onFocus={() => {
              openChallengeTooltip();
            }}
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
      </BadgeWrapper>
    </Container>
  );
};

export default LeaderboardItem;

export const Container = styled.div`
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const RankIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

export const UserInfoBox = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const UserName = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const ReadCount = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const BadgeWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

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
