import styled from '@emotion/styled';
import UserBadgeInfo from './UserBadgeInfo';
import type { Badges } from '../../types/badges';

const RANK_ICON_MAP: Record<number, string> = {
  1: '👑',
  2: '🥈',
  3: '🥉',
};

interface LeaderboardItemProps {
  rank: number;
  name: string;
  readCount: number;
  readCountLabel?: string;
  badges?: Badges;
}

const LeaderboardItem = ({
  rank,
  name,
  readCount,
  readCountLabel = '개 읽음',
  badges,
}: LeaderboardItemProps) => {
  return (
    <Container
      role="listitem"
      tabIndex={0}
      aria-label={`${rank}위: ${name}, ${readCount}${readCountLabel}`}
    >
      <ContentWrapper>
        <RankIconWrapper aria-hidden="true">
          {RANK_ICON_MAP[rank] ?? `#${rank}`}
        </RankIconWrapper>

        <UserInfoBox aria-hidden="true">
          <UserName>{name}</UserName>
          <ReadCount>
            {readCount}
            {readCountLabel}
          </ReadCount>
        </UserInfoBox>
      </ContentWrapper>

      <UserBadgeInfo badges={badges} />
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
