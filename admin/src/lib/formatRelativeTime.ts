import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

export const formatRelativeTime = (isoString: string): string => {
  return dayjs(isoString).fromNow();
};

export const formatDateDivider = (isoString: string): string => {
  return dayjs(isoString).format('YYYY년 M월 D일');
};

export const isSameDay = (a: string, b: string): boolean => {
  return dayjs(a).isSame(dayjs(b), 'day');
};
