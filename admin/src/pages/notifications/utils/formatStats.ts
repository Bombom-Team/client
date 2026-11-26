export const formatCount = (value: number) => value.toLocaleString('ko-KR');

export const formatRate = (rate: number) =>
  `${(rate * 100).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}%`;

export const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}초`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}분`;
  return `${(seconds / 3600).toLocaleString('ko-KR', {
    maximumFractionDigits: 1,
  })}시간`;
};
