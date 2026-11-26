import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { STATIC_HEAD_ATTRIBUTE } from './seo';

const WEB_ROOT = resolve(__dirname, '../..');
const SRC_ROOT = join(WEB_ROOT, 'src');
const HEAD_META_KEY_PATTERN = /\b(?:name|property):\s*'([^']+)'/g;

const getIndexHead = () =>
  new DOMParser().parseFromString(
    readFileSync(join(WEB_ROOT, 'index.html'), 'utf-8'),
    'text/html',
  ).head;

const getMetaKey = (meta: Element) =>
  meta.getAttribute('name') ?? meta.getAttribute('property');

const getSourceFiles = () =>
  readdirSync(SRC_ROOT, { recursive: true, encoding: 'utf-8' }).filter(
    (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file),
  );

describe('index.html의 head 기본값', () => {
  it('title에는 data-static-head를 붙인다', () => {
    const titles = Array.from(getIndexHead().querySelectorAll('title'));

    expect(
      titles.every((title) => title.hasAttribute(STATIC_HEAD_ATTRIBUTE)),
    ).toBe(true);
  });

  it('모든 경로가 같은 HTML을 받으므로 canonical과 og:url을 두지 않는다', () => {
    const head = getIndexHead();

    expect(head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(head.querySelector('meta[property="og:url"]')).toBeNull();
  });

  it('data-static-head 없이 둔 meta는 페이지 head에서 지정하지 않는다', () => {
    const staticMetaKeys = new Set(
      Array.from(
        getIndexHead().querySelectorAll(`meta:not([${STATIC_HEAD_ATTRIBUTE}])`),
      )
        .map(getMetaKey)
        .filter((key): key is string => key !== null),
    );

    const duplicatedKeys = getSourceFiles().flatMap((file) =>
      Array.from(
        readFileSync(join(SRC_ROOT, file), 'utf-8').matchAll(
          HEAD_META_KEY_PATTERN,
        ),
      )
        .map(([, key]) => key)
        .filter((key): key is string => !!key && staticMetaKeys.has(key))
        .map((key) => `${file}: ${key}`),
    );

    expect(duplicatedKeys).toEqual([]);
  });
});
