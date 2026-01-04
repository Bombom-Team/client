import styled from '@emotion/styled';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import CommentConfirmModalContent from './CommentConfirmModalContent';
import CommentEditor from './CommentEditor';
import NewsletterSelector from './NewsletterSelector';
import QuotationSelector from './QuotationSelector';
import useAddChallengeCommentMutation from '../../hooks/useAddChallengeCommentMutation';
import useQuotations from '../../hooks/useQuotations';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import type { CandidateArticles } from '../../types/comment';
import SparklesIcon from '#/assets/svg/sparkles.svg';

interface AddCommentModalContentProps {
  closeCommentModal: () => void;
  candidateArticles: CandidateArticles;
}

const MIN_COMMENT_LENGTH = 20;
const MAX_COMMENT_LENGTH = 250;

const AddCommentModalContent = ({
  closeCommentModal,
  candidateArticles,
}: AddCommentModalContentProps) => {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null,
  );
  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(
    null,
  );
  const [comment, setComment] = useState('');
  const [showArticleError, setShowArticleError] = useState(false);
  const [showCommentError, setShowCommentError] = useState(false);
  const {
    modalRef,
    openModal: openConfirmModal,
    closeModal: closeConfirmModal,
    isOpen,
  } = useModal();
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/comments',
  });

  const quotations = useQuotations({ articleId: selectedArticleId });
  const { mutate: addChallengeComment } = useAddChallengeCommentMutation({
    challengeId: Number(challengeId),
  });

  const selectArticle = (articleId: number) => {
    setShowArticleError(false);
    setSelectedArticleId(articleId);
  };

  const editComment = (value: string) => {
    if (value.length >= MIN_COMMENT_LENGTH) {
      setShowCommentError(false);
    }
    setComment(value);
  };

  const selectQuotation = (id: number, text: string) => {
    if (selectedQuotationId === id) {
      setSelectedQuotationId(null);
    } else {
      setSelectedQuotationId(id);
      editComment(text);
    }
  };

  const removeQuotation = () => {
    setSelectedQuotationId(null);
  };

  const handleAddCommentClick = () => {
    const isCommentValid = comment.length >= MIN_COMMENT_LENGTH;
    const isArticleValid = selectedArticleId !== null;

    if (isCommentValid && isArticleValid) {
      openConfirmModal();
    } else {
      if (!isArticleValid) {
        setShowArticleError(true);
      }
      if (!isCommentValid) {
        setShowCommentError(true);
      }
    }
  };

  const resetForm = () => {
    editComment('');
    setSelectedArticleId(null);
    setSelectedQuotationId(null);
    setShowArticleError(false);
  };

  const confirmComment = () => {
    if (!selectedArticleId) return;

    const selectedQuotation = selectedQuotationId
      ? quotations.find((quotation) => quotation.id === selectedQuotationId)
      : null;

    addChallengeComment({
      articleId: selectedArticleId,
      comment,
      quotation: selectedQuotation?.text,
    });

    closeCommentModal();
    resetForm();
  };

  return (
    <>
      <Container isMobile={isMobile}>
        <NewsletterSelector
          selectedArticleId={selectedArticleId}
          onArticleSelect={selectArticle}
          articles={candidateArticles}
          showError={showArticleError}
        />

        {selectedArticleId && (
          <QuotationSelector
            quotations={quotations}
            selectedQuotationId={selectedQuotationId}
            onQuotationSelect={selectQuotation}
            onRemoveQuotation={removeQuotation}
          />
        )}

        <CommentEditor
          comment={comment}
          onCommentChange={(value) => editComment(value)}
          minLength={MIN_COMMENT_LENGTH}
          maxLength={MAX_COMMENT_LENGTH}
          showError={showCommentError}
        />

        <TipSection isMobile={isMobile}>
          <TipTitleWrapper>
            <SparklesIcon width={12} height={12} />
            <TipTitle isMobile={isMobile}>팁</TipTitle>
          </TipTitleWrapper>
          <TipList isMobile={isMobile}>
            <TipItem>• 하이라이트를 클릭하면 인용구로 삽입됩니다.</TipItem>
            <TipItem>
              • 20자 이상의 메모를 코멘트로 바로 사용할 수 있어요.
            </TipItem>
            <TipItem>
              • 한 줄이면 충분해요. 완벽한 리뷰보다 솔직한 감상이 좋아요!
            </TipItem>
          </TipList>
        </TipSection>

        <AddCommentButton isMobile={isMobile} onClick={handleAddCommentClick}>
          등록하기
        </AddCommentButton>
      </Container>

      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeConfirmModal}
        position="center"
        showCloseButton={false}
      >
        <CommentConfirmModalContent
          closeModal={closeConfirmModal}
          onConfirm={confirmComment}
        />
      </Modal>
    </>
  );
};

export default AddCommentModalContent;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '560px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '24px' : '28px')};
  flex-direction: column;
`;

const TipSection = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '8px 12px')};
  border-radius: 8px;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;

const TipTitleWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const TipTitle = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  font-weight: 600;
`;

const TipList = styled.ul<{ isMobile: boolean }>`
  display: flex;
  gap: 4px;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body4 : theme.fonts.body3};
`;

const TipItem = styled.li``;

const AddCommentButton = styled(Button)<{ isMobile: boolean }>`
  width: 100%;
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
