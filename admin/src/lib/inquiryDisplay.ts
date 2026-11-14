import type { InquiryRoom } from '@/types/inquiry';

/**
 * 문의자 이름과 이메일을 나눠 돌려준다. 목록 카드와 상세 헤더가 둘을 각각 다른
 * 줄에 배치하므로 합치지 않고 그대로 넘긴다. contact는 복사해서 쓰는 식별자로,
 * 회원은 이메일, 비회원은 게스트 ID 전체다.
 *
 * inquirerType이 MEMBER인데 inquirerNickname이 없으면 탈퇴한 회원(Member.nickname은
 * not-null이라 정상 회원이면 반드시 값이 있다)으로 간주한다.
 */
export const getRequesterIdentity = (
  room: Pick<
    InquiryRoom,
    'inquirerType' | 'inquirerNickname' | 'inquirerEmail' | 'guestId'
  >,
): { name: string; contact: string | null } => {
  if (room.inquirerType === 'GUEST') {
    // 화면에는 앞 8자만 보여주되, 문의를 추적할 수 있도록 전체 식별자를 복사용으로
    // 함께 돌려준다.
    return {
      name: `비회원 (${room.guestId?.slice(0, 8) ?? '알 수 없음'})`,
      contact: room.guestId,
    };
  }
  return {
    name: room.inquirerNickname ?? '탈퇴한 회원',
    contact: room.inquirerEmail,
  };
};

/**
 * 목록 카드의 마지막 메시지 미리보기를 만든다.
 * 누가 보낸 메시지인지 구분할 수 있도록 양쪽 모두 작성자 이름을 앞에 붙인다.
 */
export const getLastMessagePreviewLabel = (
  room: Pick<
    InquiryRoom,
    | 'lastMessage'
    | 'inquirerType'
    | 'inquirerNickname'
    | 'inquirerEmail'
    | 'guestId'
  >,
): string => {
  if (!room.lastMessage) {
    return '메시지가 없습니다.';
  }
  // Member.nickname은 not-null이라 살아있는 관리자면 반드시 값이 있다. 탈퇴 시 member 행이
  // 실제로 삭제되는데 inquiry_message.admin_id에는 FK가 없어 그대로 남으므로, 닉네임을
  // 찾지 못했다는 것은 그 관리자가 탈퇴했다는 뜻이다.
  const senderName =
    room.lastMessage.senderType === 'ADMIN'
      ? (room.lastMessage.adminNickname ?? '탈퇴한 운영자')
      : getRequesterIdentity(room).name;
  return `${senderName}: ${room.lastMessage.content}`;
};
