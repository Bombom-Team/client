import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import useExpandQuotation from '../hooks/useExpandQuotation';
import { Comment } from '../types/comment';
import { convertRelativeTime } from '../utils/date';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import CheckIcon from '#/assets/svg/check-circle.svg';
import MailIcon from '#/assets/svg/mail.svg';

type CommentCardProps = Comment;

const DELETED_USER_NICKNAME = '탈퇴한 회원';
const MAX_QUOTATION_LINE = {
  mobile: 3,
  default: 4,
};

const CommentCard = ({
  nickname,
  newsletterName,
  isSubscribed,
  articleTitle,
  comment,
  createdAt,
  quotation,
}: CommentCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const relativeTime = convertRelativeTime(createdAt);

  const { expanded, needExpansion, quoteRef, toggleExpanded } =
    useExpandQuotation({
      quotation,
      maxLines: isMobile
        ? MAX_QUOTATION_LINE.mobile
        : MAX_QUOTATION_LINE.default,
    });

  return (
    <Container isMobile={isMobile}>
      <ArticleInfo>
        <MetaWrapper>
          <MetaInfo isMobile={isMobile}>
            {nickname ?? DELETED_USER_NICKNAME} · {relativeTime}
          </MetaInfo>
          <NewsletterBadge
            isMobile={isMobile}
            text={newsletterName}
            {...(isSubscribed && {
              icon: (
                <CheckIcon width={16} height={16} fill={theme.colors.primary} />
              ),
            })}
          />
        </MetaWrapper>
        <TitleWrapper>
          <MailIcon width={16} height={16} color={theme.colors.textSecondary} />
          <ArticleTitle isMobile={isMobile}>{articleTitle}</ArticleTitle>
        </TitleWrapper>
      </ArticleInfo>
      <Content isMobile={isMobile}>
        {quotation && (
          <Quote ref={quoteRef} isMobile={isMobile} expanded={expanded}>
            {quotation}
            {needExpansion &&
              (!expanded ? (
                <ExpandQuoteButton
                  variant="transparent"
                  onClick={toggleExpanded}
                >
                  더보기
                </ExpandQuoteButton>
              ) : (
                <HideQuoteButton variant="transparent" onClick={toggleExpanded}>
                  접기
                </HideQuoteButton>
              ))}
          </Quote>
        )}
        <Comment>{comment}</Comment>
      </Content>
    </Container>
  );
};

export default CommentCard;

const Container = styled.article<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '16px')};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ArticleInfo = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const MetaWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NewsletterBadge = styled(Badge)<{ isMobile: boolean }>`
  padding: 2px 6px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const MetaInfo = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ArticleTitle = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const Content = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '4px' : '8px')};
  flex-direction: column;
`;

const Quote = styled.div<{ isMobile: boolean; expanded: boolean }>`
  overflow: hidden;
  position: relative;
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '4px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.stroke};

  display: ${({ expanded }) => (expanded ? 'block' : '-webkit-box')};
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile, expanded }) =>
    expanded ? 'unset' : isMobile ? 3 : 4};
  text-overflow: ellipsis;
`;

const ExpandButton = styled(Button)`
  padding: 0;

  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HideQuoteButton = styled(ExpandButton)`
  margin-left: 8px;
`;

const ExpandQuoteButton = styled(ExpandButton)`
  position: absolute;
  right: 0;
  bottom: 4px;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  padding-left: 32px;

  display: block;

  background: ${({ theme }) =>
    `linear-gradient(90deg, transparent 0%, ${theme.colors.white} 40%, ${theme.colors.white} 100%)`};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    background: ${({ theme }) =>
      `linear-gradient(90deg, transparent 0%, ${theme.colors.white} 40%, ${theme.colors.white} 100%)`};
  }
`;

const Comment = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;
