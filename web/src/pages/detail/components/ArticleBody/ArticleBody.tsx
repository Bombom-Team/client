import { useModal, toast } from '@bombom/shared/ui-web';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useFloatingToolbarSelection } from './useFloatingToolbarSelection';
import { HIGHLIGHT_UNAVAILABLE_MESSAGE } from '../../constants/highlight';
import {
  getMaeilMailAnswerUrl,
  MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID,
} from '../../constants/maeilMail';
import { useAddHighlightMutation } from '../../hooks/useAddHighlightMutation';
import { useExternalLinkHandler } from '../../hooks/useExternalLinkHandler';
import { useFloatingToolbarState } from '../../hooks/useFloatingToolbarState';
import { useHighlights } from '../../hooks/useHighlights';
import { useMaeilMailAnswerButton } from '../../hooks/useMaeilMailAnswerButton';
import { useRemoveHighlightMutation } from '../../hooks/useRemoveHighlighMutation';
import { useUpdateHighlightMutation } from '../../hooks/useUpdateHighlightMutation';
import {
  removeDeletedHighlights,
  restoreHighlightAll,
  saveSelection,
} from '../../utils/highlight';
import ArticleContent from '../ArticleContent/ArticleContent';
import FloatingToolbar from '../FloatingToolbar/FloatingToolbar';
import MaeilMailAnswerModal from '../MaeilMailAnswerModal/MaeilMailAnswerModal';
import MemoPanel from '../MemoPanel/MemoPanel';
import { queries } from '@/apis/queries';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
import type { Highlight } from '../../types/highlight';
import type { GetArticleByIdResponse } from '@/apis/articles/articles.api';
import type { RefObject } from 'react';

interface ArticleBodyProps {
  contentRef: RefObject<HTMLDivElement | null>;
  articleId: number;
  articleTitle: string;
  newsletterName: string;
  articleContent: GetArticleByIdResponse['contents'];
  fontSizePercentage: ArticleFontSizePercentage;
}

const ArticleBody = ({
  contentRef,
  articleId,
  articleTitle,
  newsletterName,
  articleContent,
  fontSizePercentage,
}: ArticleBodyProps) => {
  const navigate = useNavigate();
  const {
    opened: toolbarOpened,
    position,
    mode,
    showToolbar,
    hideToolbar,
  } = useFloatingToolbarState();
  const [panelOpen, setPanelOpen] = useState(false);
  const previousFontSizePercentageRef = useRef(fontSizePercentage);
  const restoredHighlightsRef = useRef<Highlight[]>([]);
  const { highlights, isHighlightLoaded } = useHighlights({ articleId });
  const { mutate: addHighlight } = useAddHighlightMutation({
    articleId,
    contentRef,
  });
  const { mutate: updateHighlight } = useUpdateHighlightMutation({
    articleId,
  });
  const { mutate: removeHighlight } = useRemoveHighlightMutation({ articleId });
  const { activeSelectionRange, activeHighlightId } =
    useFloatingToolbarSelection({
      contentRef,
      onShow: showToolbar,
      onHide: hideToolbar,
    });

  useExternalLinkHandler(contentRef);

  const {
    modalRef: maeilMailModalRef,
    openModal: openMaeilMailModal,
    closeModal: closeMaeilMailModal,
    isOpen: isMaeilMailModalOpen,
  } = useModal();

  const isMaeilMailArticle = articleContent.includes(
    MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID,
  );
  const { data: content } = useQuery({
    ...queries.contentByArticleId({ articleId }),
    enabled: isMaeilMailArticle,
  });
  const { data: submittedAnswer } = useQuery({
    ...queries.answerByArticleId({ articleId }),
    enabled: isMaeilMailArticle,
  });
  const contentId = content?.contentId;
  const hasSubmittedAnswer = typeof submittedAnswer === 'string';

  const checkMaeilMailAnswer = () => {
    if (contentId === undefined) {
      toast.error('정답을 확인할 수 없어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (hasSubmittedAnswer) {
      navigate({ href: getMaeilMailAnswerUrl(contentId, articleId) });
      return;
    }
    openMaeilMailModal();
  };

  useMaeilMailAnswerButton({
    contentRef,
    onAnswerButtonClick: checkMaeilMailAnswer,
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

  const updateMemo = (id: number, memo: string) => {
    updateHighlight({ id, memo });
  };

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

    if (isNewMode && addNewHighlight(activeSelectionRange)) {
      trackEvent({
        category: 'Memo',
        action: 'FloatingToolbar - 하이라이트 추가',
        label: '아티클 본문',
      });
    }
    if (!isNewMode && activeHighlightId) {
      removeHighlight({ id: activeHighlightId });

      trackEvent({
        category: 'Memo',
        action: 'FloatingToolbar - 하이라이트 삭제',
        label: '아티클 본문',
      });
    }

    hideToolbar();
  };

  const handleMemoClick = () => {
    const isNewMode = mode === 'new';

    hideToolbar();

    if (isNewMode) {
      // 칠하지 못한 선택에는 메모를 달 수 없다.
      if (!addNewHighlight(activeSelectionRange)) return;

      trackEvent({
        category: 'Memo',
        action: 'FloatingToolbar - 메모 추가',
        label: '아티클 본문',
      });
    }

    setPanelOpen(true);
  };

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl || !articleContent || !isHighlightLoaded) return;

    // 목록이 갱신될 때마다 화면을 목록에 맞춘다.
    // 방금 칠해 아직 목록에 없는 형광펜은 지우지 않도록, 이전 목록에 있던 것만 지운다.
    removeDeletedHighlights(
      contentEl,
      restoredHighlightsRef.current,
      highlights,
    );
    restoreHighlightAll(contentEl, highlights);
    restoredHighlightsRef.current = highlights;
  }, [articleContent, contentRef, highlights, isHighlightLoaded]);

  return (
    <>
      <ArticleContent
        ref={contentRef}
        newsletterName={newsletterName}
        content={articleContent}
        fontSizePercentage={fontSizePercentage}
      />
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
      <MaeilMailAnswerModal
        modalRef={maeilMailModalRef}
        isOpen={isMaeilMailModalOpen}
        onClose={closeMaeilMailModal}
        articleId={articleId}
        contentId={contentId}
        question={articleTitle}
      />
    </>
  );
};

export default ArticleBody;
