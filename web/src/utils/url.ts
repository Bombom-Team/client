// web/scripts/sitemap.ts(webpack 빌드)에서도 import합니다. `@/` alias import와 브라우저 전용 API를 쓰지 않습니다.

const ALLOWED_PROTOCOL = ['https:', 'http:', 'mailto:'];
const SITE_URL = 'https://www.bombom.news';

export const validateUrl = (url: string): string => {
  try {
    const parsed = new URL(url, 'https://www.example.com');
    if (ALLOWED_PROTOCOL.includes(parsed.protocol)) return url;
  } catch {
    if (url.startsWith('/') || url.startsWith('#')) return url;
  }
  return '#';
};

export const createSlug = (text: string, fallback = '') => {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || fallback;
};

export const getNewsletterDetailUrl = (
  newsletterId: number | string,
  name: string,
) => {
  const id = String(newsletterId);
  return `${SITE_URL}/newsletters/${id}/${createSlug(name, id)}`;
};
