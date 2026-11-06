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
  // Member.nickname은 not-null이라 살아있는 관리자면 반드시 값이 있다. 탈퇴 시 member 행이
  // 실제로 삭제되는데 inquiry_message.admin_id에는 FK가 없어 그대로 남으므로, 닉네임을
  // 찾지 못했다는 것은 그 관리자가 탈퇴했다는 뜻이다.
  const prefix =
    room.lastMessage.senderType === 'ADMIN'
      ? `${room.lastMessage.adminNickname ?? '탈퇴한 운영자'}: `
      : '';
  return `${prefix}${room.lastMessage.content}`;
};
