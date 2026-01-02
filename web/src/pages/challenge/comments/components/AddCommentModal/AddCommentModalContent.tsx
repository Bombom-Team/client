import styled from '@emotion/styled';
import { useState } from 'react';
import CommentConfirmModalContent from './CommentConfirmModalContent';
import CommentWriter from './CommentWriter';
import NewsletterSelector from './NewsletterSelector';
import QuotationSelector from './QuotationSelector';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import { articleHighlights } from '@/mocks/datas/highlights';
import SparklesIcon from '#/assets/svg/sparkles.svg';

interface AddCommentModalContentProps {
  closeCommentModal: () => void;
}

const MIN_COMMENT_LENGTH = 20;
const MAX_COMMENT_LENGTH = 255;

const AddCommentModalContent = ({
  closeCommentModal,
}: AddCommentModalContentProps) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
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

  const selectedArticle = articleHighlights.find(
    (article) => article.id === selectedArticleId,
  );

  const selectArticle = (articleId: string) => {
    setShowArticleError(false);
    setSelectedArticleId(articleId);
  };

  const editComment = (value: string) => {
    setShowCommentError(false);
    setComment(value);
  };

  const selectQuotation = (id: string, text: string) => {
    setSelectedQuotationId(id);
    editComment(text);
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

  const confirmComment = () => {
    closeCommentModal();
    editComment('');
    setSelectedArticleId(null);
    setSelectedQuotationId(null);
    setShowArticleError(false);
  };

  return (
    <>
      <Container isMobile={device === 'mobile'}>
        <NewsletterSelector
          selectedArticleId={selectedArticleId}
          onArticleSelect={selectArticle}
          articles={articleHighlights}
          showError={showArticleError}
        />

        {selectedArticle && (
          <QuotationSelector
            highlights={selectedArticle.highlights}
            selectedQuotationId={selectedQuotationId}
            onQuotationSelect={selectQuotation}
            onRemoveQuotation={removeQuotation}
          />
        )}

        <CommentWriter
          comment={comment}
          onCommentChange={(value) => editComment(value)}
          minLength={MIN_COMMENT_LENGTH}
          maxLength={MAX_COMMENT_LENGTH}
          showError={showCommentError}
        />

        <TipSection isMobile={device === 'mobile'}>
          <TipTitleWrapper>
            <SparklesIcon width={12} height={12} />
            <TipTitle isMobile={device === 'mobile'}>팁</TipTitle>
          </TipTitleWrapper>
          <TipList isMobile={device === 'mobile'}>
            <TipItem>• 하이라이트를 클릭하면 인용구로 삽입됩니다.</TipItem>
            <TipItem>
              • 20자 이상의 메모를 코멘트로 바로 사용할 수 있어요.
            </TipItem>
            <TipItem>
              • 한 줄이면 충분해요. 완벽한 리뷰보다 솔직한 감상이 좋아요!
            </TipItem>
          </TipList>
        </TipSection>

        <AddCommentButton
          isMobile={device === 'mobile'}
          onClick={handleAddCommentClick}
        >
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
