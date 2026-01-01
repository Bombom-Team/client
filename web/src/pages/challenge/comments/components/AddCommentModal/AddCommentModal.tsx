import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import CommentWriter from './CommentWriter';
import NewsletterSelector from './NewsletterSelector';
import QuotationSelector from './QuotationSelector';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import { articleHighlights } from '@/mocks/datas/highlights';
import SparklesIcon from '#/assets/svg/sparkles.svg';

interface AddCommentModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
}

const MIN_COMMENT_LENGTH = 20;

const AddCommentModal = ({
  modalRef,
  isOpen,
  closeModal,
}: AddCommentModalProps) => {
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(
    null,
  );
  const [comment, setComment] = useState('');
  const device = useDevice();

  const selectedArticle = useMemo(
    () => articleHighlights.find((article) => article.id === selectedArticleId),
    [selectedArticleId],
  );

  const handleSubmit = () => {
    if (comment.length >= MIN_COMMENT_LENGTH && selectedArticleId) {
      closeModal();
      setComment('');
      setSelectedArticleId('');
      setSelectedQuotationId(null);
    }
  };

  const selectQuotation = (id: string, text: string) => {
    setSelectedQuotationId(id);
    setComment(text);
  };

  const removeQuotation = () => {
    setSelectedQuotationId(null);
  };

  const isSubmitDisabled =
    comment.length < MIN_COMMENT_LENGTH || !selectedArticleId;

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={device === 'mobile' ? 'bottom' : 'center'}
      showCloseButton={false}
    >
      <Container isMobile={device === 'mobile'}>
        <NewsletterSelector
          selectedArticleId={selectedArticleId}
          onArticleSelect={setSelectedArticleId}
          articles={articleHighlights}
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
          onCommentChange={setComment}
          minLength={MIN_COMMENT_LENGTH}
        />

        <TipSection isMobile={device === 'mobile'}>
          <TipTitleWrapper>
            <SparklesIcon width={14} height={14} />
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

        <SubmitButton
          isMobile={device === 'mobile'}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          등록하기
        </SubmitButton>
      </Container>
    </Modal>
  );
};

export default AddCommentModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '560px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '24px' : '28px')};
  flex-direction: column;
`;

const TipSection = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
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
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const TipList = styled.ul<{ isMobile: boolean }>`
  display: flex;
  gap: 4px;
  flex-direction: column;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body4 : theme.fonts.body2};
`;

const TipItem = styled.li``;

const SubmitButton = styled(Button)<{ isMobile: boolean }>`
  width: 100%;
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
