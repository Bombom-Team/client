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
        <SectionTitle isMobile={isMobile}>읽은 아티클</SectionTitle>
        <ArticleTitleWrapper>
          <NewsletterBadge isMobile={isMobile} text={newsletterName} />
          <ArticleTitle isMobile={isMobile}>{articleTitle}</ArticleTitle>
        </ArticleTitleWrapper>
      </SectionWrapper>

      {quotation && (
        <SectionWrapper>
          <SectionTitle isMobile={isMobile}>내 하이라이트/메모</SectionTitle>
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
        <StyledButton onClick={handleEditCommentClick} isMobile={isMobile}>
          수정하기
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={closeModal}
          isMobile={isMobile}
        >
          취소
        </StyledButton>
      </ButtonWrapper>
    </Container>
  );
};

export default EditCommentModalContent;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '35rem')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1.5rem' : '1.75rem')};
  flex-direction: column;
`;

const SectionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const SectionTitle = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const NewsletterBadge = styled(Badge)<{ isMobile: boolean }>`
  padding: 0.125rem 0.375rem;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const ArticleTitleWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ArticleTitle = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const StyledButton = styled(Button)<{ isMobile: boolean }>`
  flex: 1;
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const Quote = styled.div<{ isMobile: boolean }>`
  overflow: hidden;
  padding: ${({ isMobile }) =>
    isMobile ? '0.25rem 0.5rem' : '0.25rem 0.75rem'};
  border-left: 0.25rem solid ${({ theme }) => theme.colors.stroke};

  display: -webkit-box;
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile }) =>
    isMobile ? MAX_QUOTATION_LINE.mobile : MAX_QUOTATION_LINE.default};
  text-overflow: ellipsis;
`;
