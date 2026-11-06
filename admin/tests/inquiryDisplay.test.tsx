import { describe, expect, it } from 'vitest';
import {
  getLastMessagePreviewLabel,
  getRequesterLabel,
} from '../src/lib/inquiryDisplay';
import type { InquiryRoom } from '../src/types/inquiry';

const lastMessage = (
  overrides: Partial<InquiryRoom['lastMessage']> = {},
): InquiryRoom['lastMessage'] => ({
  content: '확인 후 안내드리겠습니다.',
  senderType: 'ADMIN',
  adminNickname: '담당자몽',
  createdAt: '2026-11-03T10:00:00Z',
  ...overrides,
});

describe('마지막 메시지 미리보기', () => {
  it('관리자 닉네임이 있으면 그 닉네임을 붙인다', () => {
    expect(getLastMessagePreviewLabel({ lastMessage: lastMessage() })).toBe(
      '담당자몽: 확인 후 안내드리겠습니다.',
    );
  });

  it('관리자 닉네임을 찾지 못하면 탈퇴한 운영자로 표시한다', () => {
    expect(
      getLastMessagePreviewLabel({
        lastMessage: lastMessage({ adminNickname: null }),
      }),
    ).toBe('탈퇴한 운영자: 확인 후 안내드리겠습니다.');
  });

  it('유저가 보낸 메시지에는 작성자를 붙이지 않는다', () => {
    expect(
      getLastMessagePreviewLabel({
        lastMessage: lastMessage({ senderType: 'USER', adminNickname: null }),
      }),
    ).toBe('확인 후 안내드리겠습니다.');
  });

  it('메시지가 없으면 안내 문구를 반환한다', () => {
    expect(getLastMessagePreviewLabel({ lastMessage: null })).toBe(
      '메시지가 없습니다.',
    );
  });
});

describe('문의자 표시', () => {
  it('비회원이면 게스트 식별자 앞부분을 보여준다', () => {
    expect(
      getRequesterLabel({
        inquirerType: 'GUEST',
        inquirerNickname: null,
        inquirerEmail: null,
        guestId: 'abcdefgh12345678',
      }),
    ).toBe('비회원 (abcdefgh)');
  });

  it('회원인데 닉네임이 없으면 탈퇴한 회원으로 표시한다', () => {
    expect(
      getRequesterLabel({
        inquirerType: 'MEMBER',
        inquirerNickname: null,
        inquirerEmail: 'a@b.com',
        guestId: null,
      }),
    ).toBe('탈퇴한 회원');
  });

  it('회원이면 닉네임과 이메일을 함께 표시한다', () => {
    expect(
      getRequesterLabel({
        inquirerType: 'MEMBER',
        inquirerNickname: '봄봄이',
        inquirerEmail: 'a@b.com',
        guestId: null,
      }),
    ).toBe('봄봄이 (a@b.com)');
  });
});
