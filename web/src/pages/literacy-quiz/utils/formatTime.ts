import { TIME_LIMIT_SECONDS, TIME_WARN_SECONDS } from '../constants/exam';
import type { TimerState } from '../types/literacyQuiz';

export const formatClock = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
};

// 5분 안에는 남은 시간, 넘기면 '+0:12'처럼 넘긴 시간을 보여 준다.
export const formatRemaining = (elapsedSeconds: number) => {
  if (elapsedSeconds <= TIME_LIMIT_SECONDS) {
    return formatClock(TIME_LIMIT_SECONDS - elapsedSeconds);
  }
  return `+${formatClock(elapsedSeconds - TIME_LIMIT_SECONDS)}`;
};

export const getTimerState = (elapsedSeconds: number): TimerState => {
  if (elapsedSeconds > TIME_LIMIT_SECONDS) return 'over';
  if (TIME_LIMIT_SECONDS - elapsedSeconds <= TIME_WARN_SECONDS) return 'warn';
  return 'normal';
};
