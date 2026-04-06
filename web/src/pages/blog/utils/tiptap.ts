import type { TiptapDoc, TiptapNode } from '../types/post';

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

const CHARACTER_PER_MINUTE = 500;

const countNodeTextLength = (node: TiptapNode): number => {
  const textLength = node.text?.length ?? 0;

  if (!node.content?.length) return textLength;
  return (
    textLength +
    node.content.reduce(
      (totalNodes, childNode) => totalNodes + countNodeTextLength(childNode),
      0,
    )
  );
};

export const getReadingTimeMinutes = (content: string) => {
  const doc = parseTiptapDoc(content);
  const textLength = doc.content.reduce(
    (total, node) => total + countNodeTextLength(node),
    0,
  );

  if (textLength === 0) return 0;
  return Math.ceil(textLength / CHARACTER_PER_MINUTE);
};
