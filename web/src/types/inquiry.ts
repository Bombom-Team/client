import type { components } from '@/types/openapi';

export type InquiryRoomStatus = NonNullable<
  components['schemas']['InquiryRoomResponse']['status']
>;

export type InquirySenderType = NonNullable<
  components['schemas']['InquiryMessageResponse']['senderType']
>;

export type InquiryCategory = components['schemas']['InquiryCategoryResponse'];

export type InquiryRoom = components['schemas']['InquiryRoomResponse'];

export type InquiryMessage = components['schemas']['InquiryMessageResponse'];

export const INQUIRY_ROOM_STATUS_LABELS: Record<InquiryRoomStatus, string> = {
  UNCONFIRMED: '접수됨',
  IN_PROGRESS: '답변중',
  DONE: '답변완료',
  ON_HOLD: '보류',
};

export const INQUIRY_ROOM_STATUS_BADGE_VARIANTS: Record<
  InquiryRoomStatus,
  'default' | 'outlinePrimary'
> = {
  UNCONFIRMED: 'outlinePrimary',
  IN_PROGRESS: 'outlinePrimary',
  DONE: 'default',
  ON_HOLD: 'default',
};
