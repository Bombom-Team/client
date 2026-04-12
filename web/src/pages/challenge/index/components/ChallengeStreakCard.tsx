import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import { getDisplayDays } from '@/pages/challenge/utils/streak';

const STREAK_FREEZE_IMAGE_SRC = '/assets/png/streak-freeze.png';

interface ChallengeStreakCardProps {
  challengeId: number;
}

const ChallengeStreakCard = ({ challengeId }: ChallengeStreakCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { data } = useQuery({
    ...queries.memberStreak({
      id: challengeId,
      limit: 5,
    }),
  });

  const streakDays = data?.streak ?? 0;
  const displayDays = getDisplayDays({
    streakDayList: data?.streakDays ?? [],
  });

  if (isMobile) {
    return null;
  }

  return (
    <Container isMobile={isMobile}>
      <HeaderWrapper isMobile={isMobile}>
        <FireBadge isMobile={isMobile}>
          <FireImage src="/assets/svg/fire.svg" alt="스트릭 불꽃" />
          <StreakCount isMobile={isMobile}>{streakDays}</StreakCount>
        </FireBadge>
        <TextWrapper>
          <Title isMobile={isMobile}>일 연속 참여중</Title>
        </TextWrapper>
      </HeaderWrapper>

      <WeekWrapper>
        {displayDays.map(
          ({ key, label, isCompleted, isShieldApplied, isToday }) => (
            <DayColumn key={key}>
              <DayLabel isHighlighted={isToday}>{label}</DayLabel>
              <DayCheckBox
                isCompleted={isCompleted}
                isShieldApplied={isShieldApplied}
              >
                {isShieldApplied ? (
                  <FreezeWrapper>
                    <FreezeImage
                      src={STREAK_FREEZE_IMAGE_SRC}
                      alt="스트릭 방패 적용"
                    />
                    <FreezeCheckMark>✓</FreezeCheckMark>
                  </FreezeWrapper>
                ) : isCompleted ? (
                  '✓'
                ) : (
                  ''
                )}
              </DayCheckBox>
            </DayColumn>
          ),
        )}
      </WeekWrapper>
    </Container>
  );
};

export default ChallengeStreakCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) =>
    isMobile ? '0.25rem 0.125rem 0' : '0.25rem 0 0'};

  display: flex;
  gap: 0.875rem;
  flex-direction: column;

  box-sizing: border-box;
`;

const HeaderWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 0.125rem;
  align-items: center;
`;

const FireBadge = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: ${({ isMobile }) => (isMobile ? '3.25rem' : '3.75rem')};
  height: ${({ isMobile }) => (isMobile ? '3.25rem' : '3.75rem')};

  flex-shrink: 0;
`;

const FireImage = styled.img`
  width: 100%;
  height: 100%;

  display: block;
`;

const StreakCount = styled.span<{ isMobile: boolean }>`
  position: absolute;
  top: 58%;
  left: 50%;

  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
  font-weight: 700;
  line-height: 1;

  transform: translate(-50%, -50%);
`;

const TextWrapper = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
`;

const Title = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading6};
`;

const WeekWrapper = styled.div`
  display: grid;
  gap: 0.5rem;

  grid-template-columns: repeat(5, minmax(0, 1fr));
`;

const DayColumn = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-direction: column;
  align-items: center;
`;

const DayLabel = styled.span<{ isHighlighted: boolean }>`
  color: ${({ theme, isHighlighted }) =>
    isHighlighted ? theme.colors.primary : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
  font-weight: ${({ isHighlighted }) => (isHighlighted ? 700 : 400)};
`;

const DayCheckBox = styled.div<{
  isCompleted: boolean;
  isShieldApplied: boolean;
}>`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid
    ${({ theme, isCompleted, isShieldApplied }) =>
      isShieldApplied
        ? 'transparent'
        : isCompleted
          ? theme.colors.primary
          : theme.colors.stroke};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, isCompleted, isShieldApplied }) =>
    isShieldApplied
      ? 'transparent'
      : isCompleted
        ? theme.colors.primary
        : theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.caption};
  font-weight: 700;
  line-height: 1;
`;

const FreezeWrapper = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  width: 3rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);
`;

const FreezeImage = styled.img`
  width: 3rem;
  height: 3rem;

  object-fit: contain;
`;

const FreezeCheckMark = styled.span`
  position: absolute;
  top: 45%;
  left: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.caption};
  font-weight: 700;
  line-height: 1;

  transform: translate(-50%, -50%);
`;
