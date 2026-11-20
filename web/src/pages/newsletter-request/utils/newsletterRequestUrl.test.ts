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
  ])('%s 는 받는다.', (value) => {
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
  ])('"%s" 는 받지 않는다.', (value) => {
    expect(isValidNewsletterUrl(value)).toBe(false);
  });
});
