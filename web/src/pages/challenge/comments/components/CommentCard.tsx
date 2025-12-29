import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Badge from '@/components/Badge/Badge';
import MailIcon from '#/assets/svg/mail.svg';

export interface CommentCardProps {
  nickname: string;
  newsletterName: string;
  articleTitle: string;
  createdAt: string;
  comment: string;
}

const CommentCard = ({
  nickname,
  newsletterName,
  articleTitle,
  createdAt,
  comment,
}: CommentCardProps) => {
  return (
    <Container>
      <MetaWrapper>
        <MetaInfo>
          {nickname} · {createdAt}
        </MetaInfo>
        <NewsletterBadge text={newsletterName} />
      </MetaWrapper>
      <TitleWrapper>
        <MailIcon width={16} height={16} color={theme.colors.textSecondary} />
        <ArticleTitle>{articleTitle}</ArticleTitle>
      </TitleWrapper>
      <Comment>{comment}</Comment>
    </Container>
  );
};

export default CommentCard;

const Container = styled.article`
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const MetaWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NewsletterBadge = styled(Badge)`
  padding: 2px 6px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const MetaInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ArticleTitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const Comment = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;
