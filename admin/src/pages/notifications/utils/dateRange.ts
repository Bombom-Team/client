// fcm-server 집계 API가 허용하는 최대 조회 기간
export const MAX_PERIOD_DAYS = 90;

const DAY_MS = 86_400_000;
const SEOUL_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
});

export interface DateRange {
  from: string;
  to: string;
}

// 서울 날짜 기준으로 오늘을 포함한 최근 N일 범위를 만든다.
export const getSeoulDateRange = (days: number): DateRange => {
  const now = Date.now();
  return {
    from: SEOUL_DATE_FORMAT.format(now - (days - 1) * DAY_MS),
    to: SEOUL_DATE_FORMAT.format(now),
  };
};

export const countRangeDays = ({ from, to }: DateRange) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS) + 1;

// 조회할 수 없는 범위면 사용자에게 보여줄 이유를, 조회할 수 있으면 null을 반환한다.
export const getRangeError = (range: DateRange) => {
  if (!range.from || !range.to) return '시작일과 종료일을 모두 선택해 주세요.';
  if (range.to > getSeoulDateRange(1).to)
    return '종료일은 오늘 이후로 선택할 수 없어요.';
  if (range.from > range.to) return '시작일이 종료일보다 늦어요.';
  if (countRangeDays(range) > MAX_PERIOD_DAYS)
    return `조회 기간은 최대 ${MAX_PERIOD_DAYS}일이에요.`;
  return null;
};
