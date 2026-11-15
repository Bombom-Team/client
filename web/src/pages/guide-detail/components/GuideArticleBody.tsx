import { toast } from '@bombom/shared/ui-web';
import { useEffect, useRef, useState } from 'react';
import GuideArticleContent from './GuideArticleContent';
import { useFloatingToolbarSelection } from '@/pages/detail/components/ArticleBody/useFloatingToolbarSelection';
import FloatingToolbar from '@/pages/detail/components/FloatingToolbar/FloatingToolbar';
import MemoPanel from '@/pages/detail/components/MemoPanel/MemoPanel';
import { HIGHLIGHT_UNAVAILABLE_MESSAGE } from '@/pages/detail/constants/highlight';
import { useArticleContentFontScale } from '@/pages/detail/hooks/useArticleContentFontScale';
import { useFloatingToolbarState } from '@/pages/detail/hooks/useFloatingToolbarState';
import { useHighlightHoverEffect } from '@/pages/detail/hooks/useHighlightHoverEffect';
import {
  restoreHighlightAll,
  saveSelection,
} from '@/pages/detail/utils/highlight';
import { useLocalHighlightData } from '@/pages/guide-detail/hooks/useLocalHighlightData';
import type { ArticleFontSizePercentage } from '@/pages/detail/constants/articleFontSize';

interface ArticleBodyProps {
  articleId: number;
  fontSizePercentage: ArticleFontSizePercentage;
}

const GuideArticleBody = ({
  articleId,
  fontSizePercentage,
}: ArticleBodyProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFontSizePercentageRef = useRef(fontSizePercentage);
  const {
    opened: toolbarOpened,
    position,
    mode,
    showToolbar,
    hideToolbar,
  } = useFloatingToolbarState();
  const [panelOpen, setPanelOpen] = useState(false);
  const {
    highlights,
    isHighlightLoaded,
    addHighlight,
    updateMemo,
    removeHighlight,
  } = useLocalHighlightData({ articleId, contentRef });
  const { activeSelectionRange, activeHighlightId } =
    useFloatingToolbarSelection({
      contentRef,
      onShow: showToolbar,
      onHide: hideToolbar,
    });

  const addNewHighlight = (range: Range | null) => {
    const contentEl = contentRef.current;
    if (!range || !contentEl) return false;

    const highlightData = saveSelection(contentEl, range, articleId);
    window.getSelection()?.removeAllRanges();

    if (!highlightData) {
      toast.error(HIGHLIGHT_UNAVAILABLE_MESSAGE);
      return false;
    }

    addHighlight(highlightData);
    return true;
  };
  const handleHighlightClick = () => {
    const isNewMode = mode === 'new';

    if (isNewMode) {
      addNewHighlight(activeSelectionRange);
    }
    if (!isNewMode && activeHighlightId) {
      removeHighlight({ id: activeHighlightId });
    }

    hideToolbar();
  };

  const handleMemoClick = () => {
    const isNewMode = mode === 'new';

    hideToolbar();

    // 칠하지 못한 선택에는 메모를 달 수 없다.
    if (isNewMode && !addNewHighlight(activeSelectionRange)) return;

    setPanelOpen(true);
  };

  useHighlightHoverEffect();

  useArticleContentFontScale({
    ref: contentRef,
    content: String(articleId),
    percentage: fontSizePercentage,
  });

  useEffect(() => {
    if (previousFontSizePercentageRef.current === fontSizePercentage) return;

    previousFontSizePercentageRef.current = fontSizePercentage;

    hideToolbar();
    const selection = window.getSelection();
    if (
      selection?.anchorNode &&
      contentRef.current?.contains(selection.anchorNode)
    ) {
      selection.removeAllRanges();
    }
  }, [contentRef, fontSizePercentage, hideToolbar]);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl || !isHighlightLoaded) return;

    // 이미 그린 형광펜은 건너뛰므로, 목록이 바뀔 때마다 다시 실행해도 된다.
    restoreHighlightAll(contentEl, highlights);
  }, [contentRef, highlights, isHighlightLoaded]);

  return (
    <>
      <GuideArticleContent ref={contentRef} articleId={articleId} />
      <FloatingToolbar
        opened={toolbarOpened}
        position={position}
        mode={mode}
        onHighlightButtonClick={handleHighlightClick}
        onMemoButtonClick={handleMemoClick}
      />
      <MemoPanel
        opened={panelOpen}
        memos={highlights ?? []}
        removeHighlight={removeHighlight}
        updateMemo={updateMemo}
        onCloseButtonClick={() => setPanelOpen(false)}
        onToggleButtonClick={() => setPanelOpen((prev) => !prev)}
      />
    </>
  );
};

export default GuideArticleBody;
