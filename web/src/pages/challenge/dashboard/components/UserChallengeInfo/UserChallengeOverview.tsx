import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type {
  ChallengeInfoResponse,
  MemberChallengeProgressResponse,
} from '@/apis/challenge/challenge.api';

interface UserChallengeOverviewProps {
  challengeInfo: ChallengeInfoResponse;
  memberChallengeProgressInfo: MemberChallengeProgressResponse;
}

const UserChallengeOverview = ({
  challengeInfo,
  memberChallengeProgressInfo,
}: UserChallengeOverviewProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const isPC = device === 'pc';

  const { name, generation, startDate, endDate, totalDays } = challengeInfo;

  const { nickname, completedDays, isSurvived } = memberChallengeProgressInfo;

  const completionRate = (completedDays / totalDays) * 100;

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
        <SummaryStats isMobile={isMobile} isFailed={!isSurvived}>
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
        </SummaryStats>
      </UserChallengeSummary>
    </Container>
  );
};

export default UserChallengeOverview;

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

const SummaryStats = styled.div<{ isMobile: boolean; isFailed: boolean }>`
  min-width: 0;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0' : '6px')};
  align-items: center;

  opacity: ${({ isFailed }) => (isFailed ? 0.4 : 1)};
`;

const StatBlock = styled.div`
  width: 72px;
  min-width: 0;

  display: flex;
  gap: 6px;
  flex: 1;
  flex-direction: column;
  align-items: center;
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
