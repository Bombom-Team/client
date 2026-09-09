import { getOrCreateGuestId } from './guestId';

describe('getOrCreateGuestId', () => {
  const KEY = 'bombom_guest_id';

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('저장된 guestId가 없으면 새로 생성해 localStorage에 저장한다.', () => {
    const guestId = getOrCreateGuestId();

    expect(guestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(guestId));
  });

  it('이미 저장된 guestId가 있으면 그대로 반환한다.', () => {
    const first = getOrCreateGuestId();
    const second = getOrCreateGuestId();

    expect(second).toBe(first);
  });
});
