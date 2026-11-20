import { isValidNewsletterUrl } from './newsletterRequestUrl';

describe('isValidNewsletterUrl', () => {
  it.each([
    'https://example.com',
    'http://example.com/subscribe',
    'example.com/subscribe',
    'www.example.co.kr',
    'https://example.com?subscribe=true',
    'https://example.com#subscribe',
    'example.com?ref=bombom',
  ])('%s 를 넣으면 유효한 링크로 판단한다.', (value) => {
    expect(isValidNewsletterUrl(value)).toBe(true);
  });

  it.each([
    '',
    '   ',
    'example',
    'https://example',
    'ftp://example.com',
    'https://example.com/a b',
    'hello@example.com',
    'mailto:hello@example.com',
    'https://google.com@evil.com',
    'example.com:8080/x',
    'https:///example.com',
    '한글.com',
    '뉴스레터 이름',
  ])('"%s" 를 넣으면 유효하지 않은 링크로 판단한다.', (value) => {
    expect(isValidNewsletterUrl(value)).toBe(false);
  });
});
