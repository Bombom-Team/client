import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';

const RANK_ICON_MAP: Record<number, string> = {
  1: '👑',
  2: '🥈',
  3: '🥉',
};

type MonthlyReadingBadgeGrade = 'gold' | 'silver' | 'bronze';

const BADGE_RANKING_LABEL_MAP: Record<MonthlyReadingBadgeGrade, string> = {
  gold: '1등',
  silver: '2등',
  bronze: '3등',
};

// Todo: openapi 최신화 후 컴포넌트 내 인터페이스 제거 예정
interface Badges {
  ranking: {
    grade: MonthlyReadingBadgeGrade;
    year: number;
    month: number;
  };
  challenge: {
    grade: MonthlyReadingBadgeGrade;
    name: string;
    generation: number;
  };
}

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
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipAnchor, setTooltipAnchor] = useState<{
    current: HTMLElement | null;
  } | null>(null);
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
  const challengeTooltipText = badges?.challenge?.name ?? '';

  const showTooltip = (
    text: string,
    anchorRef: { current: HTMLElement | null },
  ) => {
    setTooltipText(text);
    setTooltipAnchor(anchorRef);
  };

  const hideTooltip = () => {
    setTooltipText('');
    setTooltipAnchor(null);
  };

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
            onMouseEnter={() =>
              showTooltip(rankingTooltipText, rankingBadgeRef)
            }
            onMouseLeave={hideTooltip}
            onFocus={() => {
              showTooltip(rankingTooltipText, rankingBadgeRef);
            }}
            onBlur={hideTooltip}
          >
            <Badge
              src={rankingBadgeSrc}
              alt={`${badges.ranking.year}년 ${badges.ranking.month}월 랭킹 ${badges.ranking.grade}`}
              loading="lazy"
            />
          </BadgeItem>
        )}
        {challengeBadgeSrc && badges?.challenge && (
          <BadgeItem
            tabIndex={0}
            ref={challengeBadgeRef}
            onMouseEnter={() =>
              showTooltip(challengeTooltipText, challengeBadgeRef)
            }
            onMouseLeave={hideTooltip}
            onFocus={() => {
              showTooltip(challengeTooltipText, challengeBadgeRef);
            }}
            onBlur={hideTooltip}
          >
            <Badge
              src={challengeBadgeSrc}
              alt={`${badges.challenge.name} ${badges.challenge.generation}기 ${badges.challenge.grade}`}
              loading="lazy"
            />
          </BadgeItem>
        )}
      </BadgeWrapper>
      {tooltipText && tooltipAnchor && (
        <Tooltip opened placement="top" anchorRef={tooltipAnchor}>
          {tooltipText}
        </Tooltip>
      )}
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
