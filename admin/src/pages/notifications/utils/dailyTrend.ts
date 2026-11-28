import type {
  NotificationCategory,
  NotificationDailyStats,
} from '@/apis/notificationStats/notificationStats.api';

export interface DailyPoint {
  date: string;
  sent: number | null;
  opened: number;
  openRate: number | null;
}

interface BuildDailyPointsParams {
  daily: NotificationDailyStats[];
  categories: NotificationCategory[];
}

// 선택한 카테고리들을 날짜별로 합친다. 응답에 없는 날짜를 0으로 채우지 않는다.
export const buildDailyPoints = ({
  daily,
  categories,
}: BuildDailyPointsParams): DailyPoint[] => {
  const pointsByDate = new Map<
    string,
    { sent: number | null; opened: number }
  >();

  daily
    .filter(({ category }) => categories.includes(category))
    .forEach(({ date, sent, opened }) => {
      const current = pointsByDate.get(date) ?? { sent: 0, opened: 0 };
      pointsByDate.set(date, {
        sent:
          current.sent === null || sent === null ? null : current.sent + sent,
        opened: current.opened + opened,
      });
    });

  return [...pointsByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { sent, opened }]) => ({
      date,
      sent,
      opened,
      openRate: sent !== null && sent > 0 ? opened / sent : null,
    }));
};

// 전체 합계. 발송은 날짜별 발송 수가 있는 회원별 카테고리만, 열림은 토픽 발송까지 합친다.
// 두 합의 대상이 달라 열림률은 계산하지 않는다.
export const buildTotalDailyPoints = (
  daily: NotificationDailyStats[],
): DailyPoint[] => {
  const pointsByDate = new Map<string, { sent: number; opened: number }>();

  daily.forEach(({ date, sent, opened }) => {
    const current = pointsByDate.get(date) ?? { sent: 0, opened: 0 };
    pointsByDate.set(date, {
      sent: current.sent + (sent ?? 0),
      opened: current.opened + opened,
    });
  });

  return [...pointsByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { sent, opened }]) => ({
      date,
      sent,
      opened,
      openRate: null,
    }));
};

// 축 상한을 1·2·2.5·5·10 단위의 깔끔한 값으로 올린다.
export const getNiceCeil = (value: number) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step =
    [1, 2, 2.5, 5, 10].find((unit) => unit * magnitude >= value) ?? 10;
  return step * magnitude;
};

// 열림률 축 상한. 낮은 비율이 바닥에 붙지 않도록 10% 단위로 올리고 100%를 넘기지 않는다.
export const getRateCeil = (maxRate: number) =>
  Math.min(1, Math.max(0.1, Math.ceil(maxRate * 10) / 10));
