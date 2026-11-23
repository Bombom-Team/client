export type InquiryStatus = 'UNCONFIRMED' | 'IN_PROGRESS' | 'DONE' | 'ON_HOLD';

export type InquirySenderType = 'USER' | 'ADMIN';

export type InquirerType = 'MEMBER' | 'GUEST';

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

export interface InquiryLastMessage {
  // 사진만 보낸 메시지는 내용이 비어 있다(inquiry_message.content가 nullable).
  content: string | null;
  senderType: InquirySenderType;
  // ADMIN 발신이면서 그 관리자가 탈퇴하지 않은 경우에만 값이 있고, 그 외(USER 발신, 관리자 탈퇴)는 null.
  adminNickname: string | null;
  createdAt: string;
}

export interface InquiryRoom {
  id: number;
  categoryId: number;
  status: InquiryStatus;
  assigneeId: number | null;
  // 담당자가 없거나 탈퇴한 경우 null.
  assigneeNickname: string | null;
  inquirerType: InquirerType;
  // GUEST일 때만 값, MEMBER면 null.
  guestId: string | null;
  // inquirerType이 MEMBER인데 이 값이 null이면 탈퇴한 회원으로 간주한다.
  inquirerNickname: string | null;
  inquirerEmail: string | null;
  lastMessage: InquiryLastMessage | null;
  createdAt: string;
  closedAt: string | null;
}

// GET /inquiries/rooms/{roomId} 상세 조회 응답은 아직 목록(InquiryRoom)만큼 확장되지 않아
// memberId/guestId 조합만 내려온다. 서버가 확장되면 InquiryRoom과 합칠 수 있다.
export interface InquiryRoomDetail {
  id: number;
  memberId: number | null;
  guestId: string | null;
  categoryId: number;
  status: InquiryStatus;
  assigneeId: number | null;
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

export interface InquiryMessagePage {
  messages: InquiryMessage[];
  hasNext: boolean;
}

// 서버가 닫힌 방으로 보는 상태(InquiryRoom.isClosed). 목록의 종료 탭과 상세의 입력 잠금이
// 같은 기준을 쓰도록 한 곳에 둔다.
export const CLOSED_INQUIRY_STATUSES: InquiryStatus[] = ['DONE', 'ON_HOLD'];

export const OPEN_INQUIRY_STATUSES: InquiryStatus[] = [
  'UNCONFIRMED',
  'IN_PROGRESS',
];

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
