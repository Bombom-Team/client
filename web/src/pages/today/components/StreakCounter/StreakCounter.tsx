import styled from '@emotion/styled';

interface StreakIconProps {
  streakReadDay: number;
}

const StreakCounter = ({ streakReadDay }: StreakIconProps) => {
  return <CircleIcon>{`${streakReadDay}일`}</CircleIcon>;
};

export default StreakCounter;

const CircleIcon = styled.span`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.base};
  width: 4.25rem;
  height: 4.25rem;
  margin: 0.25rem;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading6};

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: ${({ theme }) => theme.zIndex.behind};
    width: calc(100% - 1rem);
    height: calc(100% - 1rem);
    border-radius: 50%;

    background-color: ${({ theme }) => theme.colors.white};

    content: '';
    transform: translate(-50%, -50%);
  }

  > * {
    position: relative;
    z-index: ${({ theme }) => theme.zIndex.content};
  }
`;
