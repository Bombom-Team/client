import type { TiptapDoc } from '../types/post';

export const parseTiptapDoc = (content: string): TiptapDoc => {
  const parsedContent = JSON.parse(content) as unknown;

  if (
    !parsedContent ||
    typeof parsedContent !== 'object' ||
    (parsedContent as TiptapDoc).type !== 'doc' ||
    !Array.isArray((parsedContent as TiptapDoc).content)
  ) {
    throw new Error('유효한 Tiptap 문서가 아닙니다.');
  }

  return parsedContent as TiptapDoc;
};
