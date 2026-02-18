import { fetcher } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';

export type QueueStatus =
  | 'WAITING'
  | 'ACTIVE'
  | 'ISSUED'
  | 'NOT_IN_QUEUE'
  | 'SOLD_OUT';
export type CouponName = 'apple' | 'day2-coupon' | 'avengers';
export type QueueEntry = {
  couponName: CouponName;
  status: QueueStatus;
  position: number | null;
  activeCount: number;
  activeExpiresInSeconds: number | null;
  pollingTtlSeconds: number | null;
  reason: string | null;
};
type PostQueueEntryResponse = QueueEntry;

export const postQueueEntry = async (couponName: CouponName) => {
  return fetcher.post<never, PostQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries`,
    baseUrl: ENV.eventBaseUrl,
  });
};

type GetQueueEntryResponse = QueueEntry;

export const getMyQueueEntry = async (couponName: CouponName) => {
  return fetcher.get<GetQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries/me`,
    baseUrl: ENV.eventBaseUrl,
  });
};

export const deleteMyQueueEntry = async (couponName: CouponName) => {
  return fetcher.delete({
    path: `/coupons/${couponName}/queue-entries/me`,
    baseUrl: ENV.eventBaseUrl,
  });
};

export type IssuedCoupon = {
  couponName: CouponName;
  imageUrl: string;
  issuedAt: string;
};
type PostIssueCouponResponse = {
  imageUrl: string;
  issuedAt: string;
};

export const postIssueCoupon = async (couponName: CouponName) => {
  return fetcher.post<never, PostIssueCouponResponse>({
    path: `/coupons/${couponName}/issues`,
    baseUrl: ENV.eventBaseUrl,
  });
};

type GetMyCouponsResponse = IssuedCoupon[];

export const getMyCoupons = async () => {
  return fetcher.get<GetMyCouponsResponse>({
    path: '/coupons/issues/me',
    baseUrl: ENV.eventBaseUrl,
  });
};

type PostCaptchaRequest = {
  gRecaptchaResponse: string;
};
type PostCaptchaResponse = {
  isSuccess: boolean;
  message: string;
};

export const postCaptcha = async (gRecaptchaResponse: string) => {
  return fetcher.post<PostCaptchaRequest, PostCaptchaResponse>({
    path: '/notifications/capcha',
    body: { gRecaptchaResponse },
    baseUrl: ENV.notificationBaseUrl,
  });
};
