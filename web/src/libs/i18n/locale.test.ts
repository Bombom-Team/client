import { normalizeLocale, resolveLocale } from './locale';

describe('normalizeLocale', () => {
  it('지역 코드가 붙은 언어 태그를 넣으면 언어 코드만 반환한다', () => {
    expect(normalizeLocale('en-US')).toBe('en');
    expect(normalizeLocale('en-GB')).toBe('en');
    expect(normalizeLocale('ko-KR')).toBe('ko');
  });

  it('대문자 언어 태그를 넣으면 소문자 언어 코드를 반환한다', () => {
    expect(normalizeLocale('EN')).toBe('en');
  });

  it('지원하지 않는 언어를 넣으면 null을 반환한다', () => {
    expect(normalizeLocale('ja-JP')).toBeNull();
    expect(normalizeLocale('')).toBeNull();
  });
});

describe('resolveLocale', () => {
  it('저장된 언어가 있으면 브라우저 언어보다 저장된 언어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: 'ko', browserLanguages: ['en-US'] }),
    ).toBe('ko');
  });

  it('저장된 언어가 없으면 브라우저 선호 언어 중 처음 지원하는 언어를 사용한다', () => {
    expect(
      resolveLocale({
        storedLocale: undefined,
        browserLanguages: ['ja-JP', 'en-US', 'ko-KR'],
      }),
    ).toBe('en');
  });

  it('저장된 언어가 지원하지 않는 값이면 브라우저 언어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: 'ja', browserLanguages: ['en-US'] }),
    ).toBe('en');
  });

  it('지원하는 언어를 찾지 못하면 한국어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: undefined, browserLanguages: ['ja-JP'] }),
    ).toBe('ko');
    expect(
      resolveLocale({ storedLocale: undefined, browserLanguages: [] }),
    ).toBe('ko');
  });
});
