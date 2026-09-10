export type InquiryStatus = 'UNCONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'ON_HOLD';

export type InquirySenderType = 'USER' | 'ADMIN';

export interface InquiryCategory {
  id: number;
  name: string;
}

export interface CreateInquiryCategoryParams {
  name: string;
}

export interface UpdateInquiryCategoryParams {
  id: number;
  name: string;
}

export interface InquiryRoom {
  id: number;
  categoryId: number;
  status: InquiryStatus;
  assigneeId: number | null;
  createdAt: string;
  closedAt: string | null;
}

export interface InquiryRoomDetail extends InquiryRoom {
  memberId: number | null;
  guestId: string | null;
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

export interface InquiryMessagePage {
  messages: InquiryMessage[];
  hasNext: boolean;
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  UNCONFIRMED: '미확인',
  IN_PROGRESS: '진행중',
  DONE: '완료',
  ON_HOLD: '보류',
};

export const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  UNCONFIRMED: '#EF4444',
  IN_PROGRESS: '#4F46E5',
  DONE: '#6B7280',
  ON_HOLD: '#F59E0B',
};

export const INQUIRY_CATEGORY_NAME_MAX_LENGTH = 10;
