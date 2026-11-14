import {
  getPreferredLanguages,
  normalizeLocale,
  resolveLocale,
} from './locale';

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
  it('저장된 언어가 있으면 선호 언어보다 저장된 언어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: 'ko', preferredLanguages: ['en-US'] }),
    ).toBe('ko');
  });

  it('저장된 언어가 없으면 선호 언어 중 처음 지원하는 언어를 사용한다', () => {
    expect(
      resolveLocale({
        storedLocale: undefined,
        preferredLanguages: ['ja-JP', 'en-US', 'ko-KR'],
      }),
    ).toBe('en');
  });

  it('저장된 언어가 지원하지 않는 값이면 선호 언어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: 'ja', preferredLanguages: ['en-US'] }),
    ).toBe('en');
  });

  it('지원하는 언어를 찾지 못하면 한국어를 사용한다', () => {
    expect(
      resolveLocale({ storedLocale: undefined, preferredLanguages: ['ja-JP'] }),
    ).toBe('ko');
    expect(
      resolveLocale({ storedLocale: undefined, preferredLanguages: [] }),
    ).toBe('ko');
  });
});

describe('getPreferredLanguages', () => {
  it('앱이 기기 언어를 넘기면 브라우저 언어 대신 기기 언어를 사용한다', () => {
    expect(
      getPreferredLanguages({
        deviceLanguages: ['ko-KR'],
        browserLanguages: ['en-US'],
      }),
    ).toEqual(['ko-KR']);
  });

  it('기기 언어가 없으면 브라우저 언어를 사용한다', () => {
    expect(
      getPreferredLanguages({
        deviceLanguages: undefined,
        browserLanguages: ['en-US'],
      }),
    ).toEqual(['en-US']);
  });

  it('기기 언어가 빈 배열이거나 문자열 배열이 아니면 브라우저 언어를 사용한다', () => {
    expect(
      getPreferredLanguages({ deviceLanguages: [], browserLanguages: ['en'] }),
    ).toEqual(['en']);
    expect(
      getPreferredLanguages({
        deviceLanguages: 'ko-KR',
        browserLanguages: ['en'],
      }),
    ).toEqual(['en']);
    expect(
      getPreferredLanguages({ deviceLanguages: [1], browserLanguages: ['en'] }),
    ).toEqual(['en']);
  });
});
