// Tiptap doc JSON이면 파싱해서 반환, 아니면(기존 평문 공지) null — 하위호환
// 평문이 우연히 유효 JSON('123', '[1]')이어도 doc이 아니면 평문 취급
export const parseTiptapDoc = (
  content?: string,
): Record<string, unknown> | null => {
  if (!content) return null;
  try {
    const parsed: unknown = JSON.parse(content);
    if (
      parsed &&
      typeof parsed === 'object' &&
      (parsed as Record<string, unknown>).type === 'doc'
    ) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
};

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 기존 평문 공지를 에디터로 열 때 — 줄바꿈(\n)을 문단으로 변환해 보존
// XSS 방지 위해 각 줄을 escape 후 <p>로 감쌈. 빈 줄은 빈 문단 유지.
export const plainTextToTiptapHtml = (text?: string): string => {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => `<p>${line ? escapeHtml(line) : ''}</p>`)
    .join('');
};
