import { useCallback } from 'react';
import {
  addHighlightToDOM,
  removeHighlightFromDOM,
} from '../../detail/utils/highlight';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { Highlight } from '../../detail/types/highlight';
import type { RefObject } from 'react';

type StorageKey = `guide-highlight-${string}`;

interface UseLocalHighlightDataParams {
  articleId: number;
  contentRef: RefObject<HTMLDivElement | null>;
}

export const useLocalHighlightData = ({
  articleId,
  contentRef,
}: UseLocalHighlightDataParams) => {
  const storageKey: StorageKey = `guide-highlight-${articleId}`;
  const [highlights, setHighlights] =
    useLocalStorageState<Highlight[]>(storageKey);

  const addHighlight = useCallback(
    (highlight: Omit<Highlight, 'id' | 'memo'>) => {
      const highlightWithMemo = { ...highlight, id: Date.now(), memo: '' };
      setHighlights((prev) => {
        if (!prev) {
          return [highlightWithMemo];
        }
        return [...prev, highlightWithMemo];
      });
      if (contentRef.current) {
        addHighlightToDOM(contentRef.current, highlightWithMemo);
      }
    },
    [contentRef, setHighlights],
  );

  const removeHighlight = useCallback(
    ({ id }: { id: number }) => {
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      removeHighlightFromDOM(id);
    },
    [setHighlights],
  );

  const updateMemo = useCallback(
    (id: number, memo: string) => {
      setHighlights((prev) =>
        prev.map((highlight) =>
          highlight.id === id ? { ...highlight, memo } : highlight,
        ),
      );
    },
    [setHighlights],
  );

  return {
    highlights,
    isHighlightLoaded: !!highlights,
    addHighlight,
    removeHighlight,
    updateMemo,
  };
};
