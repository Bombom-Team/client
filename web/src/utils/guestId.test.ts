import { getOrCreateGuestId } from './guestId';

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('getOrCreateGuestId', () => {
  const KEY = 'bombom_guest_id';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('저장된 guestId가 없으면 새로 생성해 localStorage에 저장한다.', () => {
    const guestId = getOrCreateGuestId();

    expect(guestId).toMatch(UUID_V4_PATTERN);
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(guestId));
  });

  it('이미 저장된 guestId가 있으면 그대로 반환한다.', () => {
    const first = getOrCreateGuestId();
    const second = getOrCreateGuestId();

    expect(second).toBe(first);
  });

  it('crypto.randomUUID가 함수가 아니면 UUID v4를 만들어 저장한다.', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      crypto,
      'randomUUID',
    );

    Object.defineProperty(crypto, 'randomUUID', {
      configurable: true,
      value: undefined,
    });

    try {
      const guestId = getOrCreateGuestId();

      expect(typeof crypto.randomUUID).not.toBe('function');
      expect(guestId).toMatch(UUID_V4_PATTERN);
      expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(guestId));
    } finally {
      if (originalDescriptor) {
        Object.defineProperty(crypto, 'randomUUID', originalDescriptor);
      } else {
        delete (crypto as { randomUUID?: unknown }).randomUUID;
      }
    }
  });
});
