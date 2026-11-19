import {
  consumePostSignupRedirect,
  savePostSignupRedirect,
} from './postSignupRedirect';

describe('postSignupRedirect', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.useRealTimers();
  });

  it('저장한 경로를 한 번만 꺼낸다.', () => {
    savePostSignupRedirect('/newsletter-requests/new');

    expect(consumePostSignupRedirect()).toBe('/newsletter-requests/new');
    expect(consumePostSignupRedirect()).toBeNull();
  });

  it('저장한 경로가 없으면 null을 반환한다.', () => {
    expect(consumePostSignupRedirect()).toBeNull();
  });

  it('외부 주소나 프로토콜 상대 주소는 저장하지 않는다.', () => {
    savePostSignupRedirect('https://example.com');
    expect(consumePostSignupRedirect()).toBeNull();

    savePostSignupRedirect('//example.com');
    expect(consumePostSignupRedirect()).toBeNull();
  });

  it('30분이 지난 경로는 쓰지 않는다.', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-11-19T10:00:00Z'));
    savePostSignupRedirect('/newsletter-requests/new');

    jest.setSystemTime(new Date('2026-11-19T10:31:00Z'));

    expect(consumePostSignupRedirect()).toBeNull();
  });
});
