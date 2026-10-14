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
