import { formatDate } from '@/utils/date';

export const convertRelativeTime = (dateString: string) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return formatDate(targetDate);
};

export const getDisplayDates = (dates: string[], today: string) => {
  return dates.filter((date) => today >= date);
};
