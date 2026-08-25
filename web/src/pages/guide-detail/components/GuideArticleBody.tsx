import { useEffect, useRef, useState } from 'react';
import GuideArticleContent from './GuideArticleContent';
import { useFloatingToolbarSelection } from '@/pages/detail/components/ArticleBody/useFloatingToolbarSelection';
import FloatingToolbar from '@/pages/detail/components/FloatingToolbar/FloatingToolbar';
import MemoPanel from '@/pages/detail/components/MemoPanel/MemoPanel';
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
  } = useLocalHighlightData({ articleId });
  const { activeSelectionRange, activeHighlightId } =
    useFloatingToolbarSelection({
      contentRef,
      onShow: showToolbar,
      onHide: hideToolbar,
    });

  const addNewHighlight = (range: Range | null) => {
    if (!range) return;

    const highlightData = saveSelection(range, articleId);
    addHighlight(highlightData);
    window.getSelection()?.removeAllRanges();
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

    if (isNewMode) {
      addNewHighlight(activeSelectionRange);
    }

    setPanelOpen(true);
    hideToolbar();
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
    if (isHighlightLoaded) restoreHighlightAll(highlights);

    // 하이라이트가 처음 로드될 때만 restore 실행 (highlight 변경 시 재실행 방지)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHighlightLoaded]);

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
