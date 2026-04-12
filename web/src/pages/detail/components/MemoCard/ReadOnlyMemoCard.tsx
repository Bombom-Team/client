import styled from '@emotion/styled';
import { formatDate } from '@/utils/date';
import type { Highlight } from '../../types/highlight';
import type { ElementType } from 'react';

const DELETE_MEMO_ARTICLE_ID = 0;

interface ReadOnlyMemoCardProps {
  data: Highlight;
  as?: ElementType;
  onClick?: () => void;
}

const ReadOnlyMemoCard = ({ data, as, onClick }: ReadOnlyMemoCardProps) => {
  const {
    text,
    memo,
    newsletterName,
    newsletterImageUrl,
    articleId,
    articleTitle,
    createdAt,
  } = data;

  const deleted = articleId === DELETE_MEMO_ARTICLE_ID;

  return (
    <Container as={as} onClick={onClick} disabled={deleted}>
      <HeaderWrapper>
        <ArticleTitle disabled={deleted}>
          {articleTitle}
          {deleted && <DeleteText>(삭제됨)</DeleteText>}
        </ArticleTitle>
      </HeaderWrapper>

      <MemoContent>
        <MemoContentText>{text}</MemoContentText>
      </MemoContent>

      <MemoText>{memo || '메모가 없습니다.'}</MemoText>

      <FooterWrapper>
        <NewsletterMeta>
          <NewsletterImage src={newsletterImageUrl} alt={newsletterName} />
          <NewsletterName>{newsletterName}</NewsletterName>
        </NewsletterMeta>
        <CreatedAtText>
          {formatDate(new Date(createdAt ?? ''), '. ')}
        </CreatedAtText>
      </FooterWrapper>
    </Container>
  );
};

export default ReadOnlyMemoCard;

const Container = styled.div<{ disabled: boolean }>`
  width: 100%;
  padding: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgb(0 0 0 / 4%);

  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;

  background-color: ${({ theme }) => theme.colors.white};
  text-align: left;

  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 8%);

    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-0.0625rem);
  }

  &:disabled {
    box-shadow: none;

    background-color: ${({ theme }) => theme.colors.disabledBackground};

    border-color: transparent;
    transform: none;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  justify-content: space-between;
`;

const NewsletterImage = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.375rem;
  box-shadow: 0 0.0625rem 0.1875rem rgb(0 0 0 / 10%);

  object-fit: cover;
`;

const NewsletterMeta = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: center;
`;

const NewsletterName = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const ArticleTitle = styled.h3<{ disabled: boolean }>`
  margin: 0;

  color: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabledText : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;
`;

const DeleteText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
  white-space: nowrap;
`;

const FooterWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

const CreatedAtText = styled.time`
  margin-top: 0.25rem;

  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const MemoContent = styled.div`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.disabledBackground} 0%,
    ${({ theme }) => theme.colors.white} 100%
  );

  transition: all 0.2s ease-in-out;
`;

const MemoContentText = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};

  word-break: break-all;
`;

const MemoText = styled.p`
  width: 100%;
  margin: 0;
  padding: 1rem;
  border: 0.125rem solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};

  transition: all 0.2s ease-in-out;
  word-break: break-all;
`;
