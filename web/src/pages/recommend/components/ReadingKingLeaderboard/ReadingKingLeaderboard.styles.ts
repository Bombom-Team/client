import styled from '@emotion/styled';

export const Container = styled.section`
  width: 100%;
  max-width: 400px;
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 20px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 10%);

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(10px);
`;

export const TitleWrapper = styled.div`
  position: relative;
  width: fit-content;

  display: flex;
  gap: 10px;
  align-items: center;
`;

export const TitleIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

export const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

export const TabToggle = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

export const TabButton = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border: none;
  border-radius: 6px;

  color: ${({ theme, active }) =>
    active ? theme.colors.textPrimary : theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  background-color: ${({ active }) => (active ? '#fff' : 'transparent')};

  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
`;

export const InfoIcon = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textTertiary};

  cursor: help;
`;

export const CountdownWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const Countdown = styled.div`
  position: relative;
  width: 36px;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  cursor: help;
`;

export const CountdownLoadingDots = styled.div`
  --dot-gradient: no-repeat
    radial-gradient(
      circle closest-side,
      ${({ theme }) => theme.colors.primaryDark} 70%,
      #0000
    );

  width: 36px;

  background:
    var(--dot-gradient) 0% 50%,
    var(--dot-gradient) 50% 50%,
    var(--dot-gradient) 100% 50%;
  background-size: calc(100% / 3) 100%;

  animation: l7 1s infinite linear;

  aspect-ratio: 4;

  @keyframes l7 {
    33% {
      background-size:
        calc(100% / 3) 0%,
        calc(100% / 3) 100%,
        calc(100% / 3) 100%;
    }

    50% {
      background-size:
        calc(100% / 3) 100%,
        calc(100% / 3) 0%,
        calc(100% / 3) 100%;
    }

    66% {
      background-size:
        calc(100% / 3) 100%,
        calc(100% / 3) 100%,
        calc(100% / 3) 0%;
    }
  }
`;

export const LeaderboardList = styled.div`
  min-height: fit-content;

  display: flex;
  gap: 32px;
  flex-direction: column;
`;

export const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};
`;
