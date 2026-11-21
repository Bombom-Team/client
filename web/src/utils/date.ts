export const formatDate = (date: Date, separator: string = '.'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + separator + month + separator + day;
};

export const formatDateToKorean = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

export const getDatesInRange = (
  startDate: string,
  endDate: string,
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const result = [];
  while (start <= end) {
    result.push(formatDate(start, '-'));
    start.setDate(start.getDate() + 1);
  }

  return result;
};

export const filterWeekdays = (dates: string[]) => {
  return dates.filter((date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6;
  });
};

export const compareDates = (date1: Date, date2: Date): -1 | 0 | 1 => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
};

export const getDatesDiff = (date1: Date, date2: Date) => {
  const timesDiff = Math.abs(date1.getTime() - date2.getTime());
  const daysDiff = Math.floor(timesDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

export const formatTimeToKorean = (date: Date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${period} ${hour12}:${minutes}`;
};

// 이 범위를 넘는 미래 시각은 기기 시계 오차가 아니라 잘못된 값으로 보고 날짜를 그대로 보여준다
const FUTURE_TOLERANCE_MS = 60 * 1000;

export const convertRelativeTime = (dateString: string) => {
  const now = new Date();
  const targetDate = new Date(dateString);
  const diffMs = now.getTime() - targetDate.getTime();

  // 날짜가 비어 있거나 형식이 깨지면 NaN 비교가 모두 false로 빠져 "NaN.NaN.NaN"이 노출된다
  if (Number.isNaN(diffMs)) return '';

  // 기기 시계가 서버보다 몇 초 늦는 일은 흔해, 그 정도 미래는 방금 보낸 것으로 다룬다
  if (diffMs < 0) {
    return diffMs < -FUTURE_TOLERANCE_MS ? formatDate(targetDate) : '방금 전';
  }

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
