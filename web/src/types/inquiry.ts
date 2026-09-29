export type InquiryRoomStatus =
  | 'UNCONFIRMED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'ON_HOLD';

export type InquirySenderType = 'USER' | 'ADMIN';

export interface InquiryCategory {
  id: number;
  name: string;
}

export interface InquiryRoom {
  id: number;
  categoryId: number;
  status: InquiryRoomStatus;
  createdAt: string;
  closedAt: string | null;
}

export interface InquiryMessage {
  id: number;
  roomId: number;
  senderType: InquirySenderType;
  adminId: number | null;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

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
