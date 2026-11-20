const HOST_PATTERN = /^([a-z0-9-]+\.)+[a-z]{2,}$/i;

export const toAbsoluteUrl = (value: string) => {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

// 도메인 바로 뒤에 ?나 #가 오는 주소도 받는다. 입력한 글자 그대로의 호스트를 검사해
// 이메일 주소(@), 포트, 한글 도메인처럼 URL 파서가 고쳐서 통과시키는 값은 받지 않는다.
export const isValidNewsletterUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  const [host = ''] = trimmed.replace(/^https?:\/\//i, '').split(/[/?#]/, 1);
  return HOST_PATTERN.test(host);
};

export const toHostLabel = (value: string) =>
  toAbsoluteUrl(value)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
