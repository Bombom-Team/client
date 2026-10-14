import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useFloatingToolbarSelection } from './useFloatingToolbarSelection';
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
import { restoreHighlightAll, saveSelection } from '../../utils/highlight';
import ArticleContent from '../ArticleContent/ArticleContent';
import FloatingToolbar from '../FloatingToolbar/FloatingToolbar';
import MaeilMailAnswerModal from '../MaeilMailAnswerModal/MaeilMailAnswerModal';
import MemoPanel from '../MemoPanel/MemoPanel';
import { queries } from '@/apis/queries';
import useModal from '@/components/Modal/useModal';
import { toast } from '@/components/Toast/utils/toastActions';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
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
  const { highlights, isHighlightLoaded } = useHighlights({ articleId });
  const { mutate: addHighlight } = useAddHighlightMutation();
  const { mutate: updateHighlight } = useUpdateHighlightMutation();
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
    if (!range) return;

    const highlightData = saveSelection(range, articleId);
    addHighlight(highlightData);
    window.getSelection()?.removeAllRanges();
  };

  const handleHighlightClick = () => {
    const isNewMode = mode === 'new';

    if (isNewMode) {
      addNewHighlight(activeSelectionRange);

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

    if (isNewMode) {
      addNewHighlight(activeSelectionRange);

      trackEvent({
        category: 'Memo',
        action: 'FloatingToolbar - 메모 추가',
        label: '아티클 본문',
      });
    }

    setPanelOpen(true);
    hideToolbar();
  };

  useEffect(() => {
    if (!articleContent) return;

    if (isHighlightLoaded) restoreHighlightAll(highlights);

    // 하이라이트가 처음 로드될 때만 restore 실행 (highlight 변경 시 재실행 방지)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleContent, isHighlightLoaded]);

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
