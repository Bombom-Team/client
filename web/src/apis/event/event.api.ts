import { fetcher } from '@bombom/shared/apis';

export type QueueStatus = 'WAITING' | 'ACTIVE' | 'ISSUED' | 'NOT_IN_QUEUE';
export type QueueEntry = {
  couponName: string;
  status: QueueStatus;
  position: number | null;
  activeCount: number;
  activeExpiresInSeconds: number | null;
  pollingTtlSeconds: number | null;
};
type PostQueueEntryResponse = QueueEntry;

export const postQueueEntry = async (couponName: string) => {
  return fetcher.post<never, PostQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries`,
  });
};

type GetQueueEntryResponse = QueueEntry;

export const getMyQueueEntry = async (couponName: string) => {
  return fetcher.get<GetQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries/me`,
  });
};
