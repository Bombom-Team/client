import { fetcher } from '@bombom/shared/apis';

export type QueueStatus = 'WAITING' | 'ACTIVE' | 'ISSUED' | 'NOT_IN_QUEUE';
export type CouponName = 'day1-coupon' | 'day2-coupon';
export type QueueEntry = {
  couponName: CouponName;
  status: QueueStatus;
  position: number | null;
  activeCount: number;
  activeExpiresInSeconds: number | null;
  pollingTtlSeconds: number | null;
};
type PostQueueEntryResponse = QueueEntry;

export const postQueueEntry = async (couponName: CouponName) => {
  return fetcher.post<never, PostQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries`,
  });
};

type GetQueueEntryResponse = QueueEntry;

export const getMyQueueEntry = async (couponName: CouponName) => {
  return fetcher.get<GetQueueEntryResponse>({
    path: `/coupons/${couponName}/queue-entries/me`,
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
  });
};

type GetMyCouponsResponse = IssuedCoupon[];

export const getMyCoupons = async () => {
  return fetcher.get<GetMyCouponsResponse>({
    path: '/coupons/issues/me',
  });
};

type PostCaptchaRequest = {
  gRecaptchaResponse: string;
};
type PostCaptchaResponse = {
  success: boolean;
};

export const postCaptcha = async (gRecaptchaResponse: string) => {
  return fetcher.post<PostCaptchaRequest, PostCaptchaResponse>({
    path: '/notifications/captcha',
    body: { gRecaptchaResponse },
  });
};
