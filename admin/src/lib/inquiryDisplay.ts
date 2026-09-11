import type { InquiryRoom } from '@/types/inquiry';

// inquirerType이 MEMBER인데 inquirerNickname이 없으면 탈퇴한 회원(Member.nickname은 not-null이라
// 정상 회원이면 반드시 값이 있다)으로 간주한다.
export const getRequesterLabel = (
  room: Pick<
    InquiryRoom,
    'inquirerType' | 'inquirerNickname' | 'inquirerEmail' | 'guestId'
  >,
): string => {
  if (room.inquirerType === 'GUEST') {
    return `비회원 (${room.guestId?.slice(0, 8) ?? '알 수 없음'})`;
  }
  if (!room.inquirerNickname) {
    return '탈퇴한 회원';
  }
  return room.inquirerEmail
    ? `${room.inquirerNickname} (${room.inquirerEmail})`
    : room.inquirerNickname;
};

export const getLastMessagePreviewLabel = (
  room: Pick<InquiryRoom, 'lastMessage'>,
): string => {
  if (!room.lastMessage) {
    return '메시지가 없습니다.';
  }
  const prefix =
    room.lastMessage.senderType === 'ADMIN'
      ? `${room.lastMessage.adminNickname ?? '탈퇴한 관리자'}: `
      : '';
  return `${prefix}${room.lastMessage.content}`;
};
