import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type {
  GetChallengeInfoResponse,
  GetMemberChallengeProgressResponse,
} from '@/apis/challenge/challenge.api';

interface UserChallengeOverviewProps {
  challengeInfo: GetChallengeInfoResponse;
  memberChallengeProgressInfo: GetMemberChallengeProgressResponse;
}

const UserChallengeOverview = ({
  challengeInfo,
  memberChallengeProgressInfo,
}: UserChallengeOverviewProps) => {
  const [isStreakAnimating, setIsStreakAnimating] = useState(false);
  const previousStreakRef = useRef<number | null>(null);
  const device = useDevice();
  const isMobile = device === 'mobile';
  const isPC = device === 'pc';

  const { name, generation, startDate, endDate, totalDays } = challengeInfo;

  const { nickname, completedDays, isSurvived, streak, shield } =
    memberChallengeProgressInfo;

  const completionRate = (completedDays / totalDays) * 100;

  useEffect(() => {
    const previousStreak = previousStreakRef.current;
    previousStreakRef.current = streak;

    if (previousStreak === null || previousStreak + 1 !== streak) {
      return;
    }

    setIsStreakAnimating(true);

    const timeoutId = window.setTimeout(() => {
      setIsStreakAnimating(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [streak]);

  return (
    <Container isMobile={isMobile}>
      <ChallengeHeader isMobile={isMobile}>
        <ChallengeTitle isMobile={isMobile}>
          {name} {generation}
        </ChallengeTitle>
        <ChallengePeriod isMobile={isMobile}>
          {formatDate(new Date(startDate)).slice(2)} ~{' '}
          {formatDate(new Date(endDate)).slice(2)}
        </ChallengePeriod>
      </ChallengeHeader>

      <UserChallengeSummary isMobile={isMobile} isFailed={!isSurvived}>
        {!isSurvived && (
          <FailedOverlay isMobile={isMobile}>
            아쉽게도 이번 챌린지의 달성률에 도달하지 못했어요 🥲
          </FailedOverlay>
        )}
        <SummaryInfo>
          {isPC && (
            <>
              <SummaryName isMobile={isMobile}>{nickname}</SummaryName>
            </>
          )}
        </SummaryInfo>
        <SummaryStats isMobile={isMobile} isSurvived={isSurvived}>
          <StatBlock>
            <ParticipationValueRow>
              <StreakBadge isAnimating={isStreakAnimating} isMobile={isMobile}>
                <FireIconImage
                  src="/assets/svg/fire.svg"
                  alt=""
                  width={72}
                  height={72}
                />
                <StreakCount isMobile={isMobile}>{streak}</StreakCount>
              </StreakBadge>
            </ParticipationValueRow>
          </StatBlock>
          <StatBlock>
            <StatValue isMobile={isMobile}>{completedDays}일</StatValue>
            <StatLabel isMobile={isMobile}>참여 중</StatLabel>
          </StatBlock>
          <StatDivider />
          <StatBlock>
            <StatValue isMobile={isMobile}>
              {completionRate.toFixed(1)}%
            </StatValue>
            <StatLabel isMobile={isMobile}>달성률</StatLabel>
          </StatBlock>
          <StatDivider />
          <StatBlock>
            <StatValue isMobile={isMobile}>{shield}개</StatValue>
            <StatLabel isMobile={isMobile}>쉴드</StatLabel>
          </StatBlock>
        </SummaryStats>
      </UserChallengeSummary>
    </Container>
  );
};

export default UserChallengeOverview;

const sway = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-6deg);
  }

  50% {
    transform: rotate(0deg);
  }

  75% {
    transform: rotate(6deg);
  }

  100% {
    transform: rotate(0deg);
  }
`;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '40px')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'row' : 'column')};
`;

const ChallengeHeader = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const ChallengeTitle = styled.span<{ isMobile: boolean }>`
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const ChallengePeriod = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.disabledText};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.heading6};
`;

const UserChallengeSummary = styled.div<{
  isMobile: boolean;
  isFailed: boolean;
}>`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px 24px')};
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: ${({ theme, isFailed }) =>
    isFailed ? theme.colors.disabledBackground : theme.colors.primaryInfo};

  ${({ isMobile }) => !isMobile && 'flex: 1;'}
`;

const SummaryInfo = styled.div`
  min-width: 0;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const SummaryName = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
  ${({ isMobile }) =>
    isMobile &&
    `
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

const SummaryStats = styled.div<{ isMobile: boolean; isSurvived: boolean }>`
  min-width: 0;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0' : '6px')};
  align-items: center;

  opacity: ${({ isSurvived }) => (!isSurvived ? 0.4 : 1)};
`;

const StatBlock = styled.div`
  width: auto;
  min-width: 72px;
  padding: 0 6px;

  display: flex;
  gap: 6px;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const ParticipationValueRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StreakBadge = styled.div<{
  isAnimating: boolean;
  isMobile: boolean;
}>`
  position: relative;

  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  animation: ${({ isAnimating }) =>
    isAnimating ? `${sway} 0.6s ease-in-out 5` : 'none'};

  transform-origin: center bottom;
`;

const FireIconImage = styled.img`
  display: block;
`;

const StreakCount = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: 60%;
  left: 50%;
  z-index: 1;

  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 700;
  line-height: 1;

  transform: translate(-50%, -50%);
`;

const StatValue = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const StatLabel = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.disabledText};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.caption : theme.fonts.body3};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 36px;

  background: ${({ theme }) => theme.colors.dividers};
`;

const FailedOverlay = styled.div<{ isMobile: boolean }>`
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(255 255 255 / 70%);
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body1 : theme.fonts.heading5};

  inset: 0;
  pointer-events: none;
`;
