import { describe, expect, it } from 'vitest';
import {
  getLastMessagePreviewLabel,
  getRequesterIdentity,
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

const memberRoom = {
  inquirerType: 'MEMBER' as const,
  inquirerNickname: '봄봄이',
  inquirerEmail: 'bom@bombom.news',
  guestId: null,
};

const guestRoom = {
  inquirerType: 'GUEST' as const,
  inquirerNickname: null,
  inquirerEmail: null,
  guestId: '4034bc92-0138-4633-a534-8569b7b4c138',
};

describe('마지막 메시지 미리보기', () => {
  it('관리자가 보냈으면 관리자 닉네임을 붙인다', () => {
    expect(
      getLastMessagePreviewLabel({ ...memberRoom, lastMessage: lastMessage() }),
    ).toBe('담당자몽: 확인 후 안내드리겠습니다.');
  });

  it('관리자 닉네임을 찾지 못하면 탈퇴한 운영자로 표시한다', () => {
    expect(
      getLastMessagePreviewLabel({
        ...memberRoom,
        lastMessage: lastMessage({ adminNickname: null }),
      }),
    ).toBe('탈퇴한 운영자: 확인 후 안내드리겠습니다.');
  });

  it('회원이 보냈으면 회원 닉네임을 붙인다', () => {
    expect(
      getLastMessagePreviewLabel({
        ...memberRoom,
        lastMessage: lastMessage({ senderType: 'USER', adminNickname: null }),
      }),
    ).toBe('봄봄이: 확인 후 안내드리겠습니다.');
  });

  it('비회원이 보냈으면 비회원 표기를 붙인다', () => {
    expect(
      getLastMessagePreviewLabel({
        ...guestRoom,
        lastMessage: lastMessage({ senderType: 'USER', adminNickname: null }),
      }),
    ).toBe('비회원 (4034bc92): 확인 후 안내드리겠습니다.');
  });

  it('메시지가 없으면 안내 문구를 반환한다', () => {
    expect(
      getLastMessagePreviewLabel({ ...memberRoom, lastMessage: null }),
    ).toBe('메시지가 없습니다.');
  });
});

describe('문의자 표시', () => {
  it('회원이면 닉네임과 이메일을 나눠서 돌려준다', () => {
    expect(
      getRequesterIdentity({
        inquirerType: 'MEMBER',
        inquirerNickname: '봄봄이',
        inquirerEmail: 'a@b.com',
        guestId: null,
      }),
    ).toEqual({ name: '봄봄이', contact: 'a@b.com' });
  });

  it('비회원은 전체 게스트 ID를 복사용으로 돌려준다', () => {
    expect(
      getRequesterIdentity({
        inquirerType: 'GUEST',
        inquirerNickname: null,
        inquirerEmail: null,
        guestId: 'abcdefgh12345678',
      }),
    ).toEqual({
      name: '비회원 (abcdefgh)',
      contact: 'abcdefgh12345678',
    });
  });

  // 닉네임이 사라져도 어느 계정의 문의였는지 추적할 수 있도록 이메일은 남긴다.
  it('탈퇴한 회원도 이메일은 남겨서 보여준다', () => {
    expect(
      getRequesterIdentity({
        inquirerType: 'MEMBER',
        inquirerNickname: null,
        inquirerEmail: 'a@b.com',
        guestId: null,
      }),
    ).toEqual({ name: '탈퇴한 회원', contact: 'a@b.com' });
  });
});
