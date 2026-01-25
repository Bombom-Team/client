import styled from '@emotion/styled';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipPositionRef = useRef({ x: 0, y: 0 });
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

  const updateTooltipPosition = (x: number, y: number) => {
    if (!tooltipRef.current) return;
    tooltipRef.current.style.left = `${x}px`;
    tooltipRef.current.style.top = `${y}px`;
  };

  const showTooltip = (
    text: string,
    rect: DOMRect,
    align: 'left' | 'center' = 'left',
  ) => {
    const x = align === 'center' ? rect.left + rect.width / 2 : rect.left;
    const y = rect.top - 30;
    tooltipPositionRef.current = { x, y };
    updateTooltipPosition(x, y);
    setTooltipText(text);
  };

  const hideTooltip = () => {
    setTooltipText('');
  };

  useLayoutEffect(() => {
    if (!tooltipText) return;
    const { x, y } = tooltipPositionRef.current;
    updateTooltipPosition(x, y);
  }, [tooltipText]);

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
            onMouseEnter={(event) =>
              showTooltip(
                rankingTooltipText,
                event.currentTarget.getBoundingClientRect(),
              )
            }
            onMouseLeave={hideTooltip}
            onFocus={(event) => {
              showTooltip(
                rankingTooltipText,
                event.currentTarget.getBoundingClientRect(),
                'center',
              );
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
            onMouseEnter={(event) =>
              showTooltip(
                challengeTooltipText,
                event.currentTarget.getBoundingClientRect(),
              )
            }
            onMouseLeave={hideTooltip}
            onFocus={(event) => {
              showTooltip(
                challengeTooltipText,
                event.currentTarget.getBoundingClientRect(),
                'center',
              );
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
      {tooltipText &&
        typeof document !== 'undefined' &&
        createPortal(
          <FloatingTooltip ref={tooltipRef} role="status">
            {tooltipText}
          </FloatingTooltip>,
          document.body,
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

const FloatingTooltip = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.floating};
  max-width: 240px;
  padding: 8px 10px;
  border-radius: 10px;
  box-shadow: 0 10px 20px -12px rgb(0 0 0 / 35%);

  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.caption};
  white-space: normal;

  pointer-events: none;
  transform: translate(0, -8px);
  word-break: keep-all;

  @media (width <= 768px) {
    max-width: calc(100vw - 24px);

    font-size: 12px;
    line-height: 1.4;
  }
`;
