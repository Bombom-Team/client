import styled from '@emotion/styled';
import { useState } from 'react';
import {
  COMMENT_VALIDATION,
  MAX_QUOTATION_LINE,
} from '../../constants/comment';
import CommentEditor from '../AddCommentModal/CommentEditor';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

interface EditCommentModalContentProps {
  closeModal: () => void;
  postedComment: string;
  articleTitle: string;
  newsletterName: string;
  quotation?: string;
  onEdit: (newComment: string) => void;
}

const EditCommentModalContent = ({
  closeModal,
  postedComment,
  articleTitle,
  newsletterName,
  quotation,
  onEdit,
}: EditCommentModalContentProps) => {
  const [comment, setComment] = useState(postedComment);
  const [showCommentError, setShowCommentError] = useState(false);

  const device = useDevice();
  const isMobile = device === 'mobile';

  const editComment = (value: string) => {
    if (value.length >= COMMENT_VALIDATION.minLength) {
      setShowCommentError(false);
    }
    setComment(value);
  };

  const handleEditCommentClick = () => {
    if (comment.length < COMMENT_VALIDATION.minLength) {
      setShowCommentError(true);
      return;
    }

    onEdit(comment);
    closeModal();
  };

  return (
    <Container isMobile={isMobile}>
      <SectionWrapper>
        <SectionTitle>읽은 아티클</SectionTitle>
        <ArticleTitleWrapper>
          <NewsletterBadge text={newsletterName} />
          <ArticleTitle>{articleTitle}</ArticleTitle>
        </ArticleTitleWrapper>
      </SectionWrapper>

      {quotation && (
        <SectionWrapper>
          <SectionTitle>내 하이라이트/메모</SectionTitle>
          <Quote isMobile={isMobile}>{quotation}</Quote>
        </SectionWrapper>
      )}

      <CommentEditor
        comment={comment}
        onCommentChange={editComment}
        minLength={COMMENT_VALIDATION.minLength}
        maxLength={COMMENT_VALIDATION.maxLength}
        showError={showCommentError}
      />

      <ButtonWrapper>
        <StyledButton onClick={handleEditCommentClick}>수정하기</StyledButton>
        <StyledButton variant="outlined" onClick={closeModal}>
          취소
        </StyledButton>
      </ButtonWrapper>
    </Container>
  );
};

export default EditCommentModalContent;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '560px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '24px' : '28px')};
  flex-direction: column;
`;

const SectionWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const NewsletterBadge = styled(Badge)`
  padding: 2px 6px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const ArticleTitleWrapper = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ArticleTitle = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledButton = styled(Button)`
  flex: 1;
  font: ${({ theme }) => theme.fonts.body1};
`;

const Quote = styled.div<{ isMobile: boolean }>`
  overflow: hidden;
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '4px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.stroke};

  display: -webkit-box;
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile }) =>
    isMobile ? MAX_QUOTATION_LINE.mobile : MAX_QUOTATION_LINE.default};
  text-overflow: ellipsis;
`;
