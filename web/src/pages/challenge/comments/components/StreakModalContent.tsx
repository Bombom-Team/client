import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import { getDisplayDays } from '@/pages/challenge/utils/streak';

const STREAK_IMAGE_SRC = '/assets/png/streak.png';
const STREAK_FREEZE_IMAGE_SRC = '/assets/png/streak-freeze.png';

interface StreakModalContentProps {
  onClose: () => void;
  challengeId: number;
}

const StreakModalContent = ({
  onClose,
  challengeId,
}: StreakModalContentProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const { data } = useQuery({
    ...queries.memberStreak({
      id: challengeId,
      limit: 5,
    }),
    enabled: challengeId > 0,
  });
  const streakDays = Math.max(data?.streak ?? 1, 1);
  const streakDayList = data?.streakDays ?? [];
  const displayDays = getDisplayDays({
    streakDayList,
  });
  const encouragementMessage =
    streakDays === 1
      ? '첫 도전을 축하해요!'
      : '잘 하고 있어요! 내일도 오실거죠?';

  return (
    <Container isMobile={isMobile}>
      <TitleWrapper>
        <Title isMobile={isMobile}>{`${streakDays} Day`}</Title>
        <Subtitle isMobile={isMobile}>스트릭</Subtitle>
      </TitleWrapper>
      <FlameWrapper isMobile={isMobile}>
        <Fire src={STREAK_IMAGE_SRC} alt="스트릭 불꽃" isMobile={isMobile} />
      </FlameWrapper>
      <WeekWrapper>
        {displayDays.map(
          ({ key, label, isCompleted, isShieldApplied, isToday }) => {
            return (
              <DayColumn key={key}>
                <DayLabel isHighlighted={isToday}>{label}</DayLabel>
                <DayCheckBox
                  isCompleted={isCompleted}
                  isHighlighted={isToday}
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
                  ) : (
                    isCompleted && <CheckMark>✓</CheckMark>
                  )}
                </DayCheckBox>
              </DayColumn>
            );
          },
        )}
      </WeekWrapper>
      <Description isMobile={isMobile}>
        챌린지 기록이 꾸준히 쌓이고 있어요.
      </Description>
      <EncouragementText isMobile={isMobile}>
        {encouragementMessage}
      </EncouragementText>
      <ButtonWrapper>
        <ConfirmButton onClick={onClose}>
          뉴스레터 마저 읽으러 가기
        </ConfirmButton>
      </ButtonWrapper>
    </Container>
  );
};

export default StreakModalContent;

const bounce = keyframes`
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: drop-shadow(0 0.625rem 1.125rem rgb(255 153 0 / 18%));
  }
  22% {
    transform: translate3d(0, -0.375rem, 0) scale(1.04);
    filter: drop-shadow(0 0.875rem 1.5rem rgb(255 168 0 / 24%));
  }
  45% {
    transform: translate3d(0, 0, 0) scale(0.98);
    filter: drop-shadow(0 0.625rem 1.125rem rgb(255 145 0 / 18%));
  }
  65% {
    transform: translate3d(0, -0.1875rem, 0) scale(1.02);
    filter: drop-shadow(0 0.75rem 1.25rem rgb(255 176 0 / 22%));
  }
  82% {
    transform: translate3d(0, 0, 0) scale(1.01);
    filter: drop-shadow(0 0.6875rem 1.1875rem rgb(255 160 0 / 20%));
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    filter: drop-shadow(0 0.625rem 1.125rem rgb(255 153 0 / 18%));
  }
`;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : 'min(35rem, 72vw)')};
  padding: ${({ isMobile }) =>
    isMobile ? '0.25rem 0.25rem 0' : '0.25rem 0 0'};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1rem' : '1.25rem')};
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading3 : theme.fonts.heading2};
  font-weight: 800;
`;

const Subtitle = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
  font-weight: 700;
`;

const FlameWrapper = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '10rem' : '11.75rem')};
  height: ${({ isMobile }) => (isMobile ? '10rem' : '11.75rem')};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: radial-gradient(
    circle,
    rgb(255 175 44 / 22%) 0%,
    transparent 70%
  );
`;

const Fire = styled.img<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '7.25rem' : '9.25rem')};
  height: ${({ isMobile }) => (isMobile ? '7.25rem' : '9.25rem')};

  animation: ${bounce} 1.9s ease-in-out infinite;

  object-fit: contain;
  will-change: transform;
`;

const WeekWrapper = styled.div`
  width: 100%;
  max-width: 360px;

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
    isHighlighted ? theme.colors.primary : theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 700;
`;

const DayCheckBox = styled.div<{
  isCompleted: boolean;
  isHighlighted: boolean;
  isShieldApplied: boolean;
}>`
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  box-shadow: ${({ isHighlighted }) =>
    isHighlighted ? '0 0.375rem 1rem rgb(0 170 255 / 24%)' : 'none'};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({
    theme,
    isCompleted,
    isHighlighted,
    isShieldApplied,
  }) => {
    if (isShieldApplied) return 'transparent';
    if (isHighlighted) return theme.colors.primary;
    return isCompleted ? theme.colors.primary : theme.colors.stroke;
  }};
  color: ${({ theme }) => theme.colors.white};
`;

const CheckMark = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1;
`;

const FreezeWrapper = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  width: 4rem;
  height: 4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translate(-50%, -50%);
`;

const FreezeImage = styled.img`
  width: 4.25rem;
  height: 4.25rem;

  object-fit: contain;
`;

const FreezeCheckMark = styled.span`
  position: absolute;
  top: 30%;
  left: 40%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1;
`;

const Description = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  line-height: 1.6;
`;

const EncouragementText = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body1 : theme.fonts.heading6};
  font-weight: 600;
`;

const ButtonWrapper = styled.div`
  width: 100%;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  min-height: 3.5rem;
  border-radius: 1.125rem;

  font: ${({ theme }) => theme.fonts.body1};
`;
