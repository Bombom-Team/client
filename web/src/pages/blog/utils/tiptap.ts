import { validateTiptapDoc } from '@/utils/tiptap/validateTiptapDoc';
import type { TiptapNode } from '@/utils/tiptap/types';

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
  const doc = validateTiptapDoc(content);
  const textLength = doc.content.reduce(
    (total, node) => total + countNodeTextLength(node),
    0,
  );

  if (textLength === 0) return 0;
  return Math.ceil(textLength / CHARACTER_PER_MINUTE);
};

const collectNodeText = (node: TiptapNode): string => {
  if (node.text) return node.text;
  if (node.type === 'hardBreak') return ' ';

  const childText = (node.content ?? []).map(collectNodeText).join('');
  // text가 아닌 노드는 문단·목록 같은 블록이므로 다음 블록과 붙지 않게 공백을 둡니다.
  return `${childText} `;
};

export const getPlainText = (content: string) => {
  const doc = validateTiptapDoc(content);

  return doc.content.map(collectNodeText).join('').replace(/\s+/g, ' ').trim();
};
