import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { GetMemberChallengeProgressResponse } from '@/apis/challenge/challenge.api';

interface UserChallengeSummaryCardProps {
  memberChallengeProgressInfo: GetMemberChallengeProgressResponse;
  completionRate: number;
  showNickname?: boolean;
}

const UserChallengeSummaryCard = ({
  memberChallengeProgressInfo,
  completionRate,
  showNickname = false,
}: UserChallengeSummaryCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const { nickname, completedDays, isSurvived, streak, shield } =
    memberChallengeProgressInfo;

  return (
    <Container isMobile={isMobile} isFailed={!isSurvived}>
      {!isSurvived && (
        <FailedOverlay isMobile={isMobile}>
          아쉽게도 이번 챌린지의 달성률에 도달하지 못했어요 🥲
        </FailedOverlay>
      )}
      <SummaryInfo>
        {showNickname && (
          <SummaryName isMobile={isMobile}>{nickname}</SummaryName>
        )}
      </SummaryInfo>
      <SummaryStats isMobile={isMobile} isSurvived={isSurvived}>
        <StatBlock isMobile={isMobile}>
          <ParticipationValueRow>
            <StreakBadge>
              <FireIconImage
                src="/assets/svg/fire.svg"
                alt=""
                width={isMobile ? 56 : 72}
                height={isMobile ? 56 : 72}
              />
              <StreakCount isMobile={isMobile}>{streak}</StreakCount>
            </StreakBadge>
          </ParticipationValueRow>
        </StatBlock>
        <StatBlock isMobile={isMobile}>
          <StatValue isMobile={isMobile}>{completedDays}일</StatValue>
          <StatLabel>참여 중</StatLabel>
        </StatBlock>
        <StatDivider />
        <StatBlock isMobile={isMobile}>
          <StatValue isMobile={isMobile}>
            {completionRate.toFixed(1)}%
          </StatValue>
          <StatLabel>달성률</StatLabel>
        </StatBlock>
        <StatDivider />
        <StatBlock isMobile={isMobile}>
          <StatValue isMobile={isMobile}>{shield}개</StatValue>
          <StatLabel>쉴드</StatLabel>
        </StatBlock>
      </SummaryStats>
    </Container>
  );
};

export default UserChallengeSummaryCard;

const Container = styled.div<{ isMobile: boolean; isFailed: boolean }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px 24px')};
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 16px;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '24px')};
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? 'center' : 'space-between')};

  background: ${({ theme, isFailed }) =>
    isFailed ? theme.colors.disabledBackground : theme.colors.primaryInfo};
`;

const SummaryInfo = styled.div`
  min-width: 0;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const SummaryName = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Regular : theme.fonts.t7Bold};
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
  justify-content: space-between;

  opacity: ${({ isSurvived }) => (!isSurvived ? 0.4 : 1)};
`;

const StatBlock = styled.div<{ isMobile: boolean }>`
  width: auto;
  min-width: ${({ isMobile }) => (isMobile ? '48px' : '72px')};
  padding: ${({ isMobile }) => (isMobile ? '0 4px' : '0 6px')};

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

const StreakBadge = styled.div`
  position: relative;

  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

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
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Regular : theme.fonts.t7Bold};
  font-weight: 700;
  line-height: 1;

  transform: translate(-50%, -50%);
`;

const StatValue = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Regular : theme.fonts.t7Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.disabledText};
  font: ${({ theme }) => theme.fonts.t3Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;

  background: ${({ theme }) => theme.colors.dividers};
`;

const FailedOverlay = styled.div<{ isMobile: boolean }>`
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(255 255 255 / 70%);
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Regular : theme.fonts.t7Bold};

  inset: 0;
  pointer-events: none;
`;
