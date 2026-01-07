import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useRef, useState, useEffect } from 'react';
import { Comment } from '../types/comment';
import { convertRelativeTime } from '../utils/date';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import CheckIcon from '#/assets/svg/check-circle.svg';
import MailIcon from '#/assets/svg/mail.svg';

type CommentCardProps = Comment;

const DELETED_USER_NICKNAME = '탈퇴한 회원';

const CommentCard = ({
  nickname,
  newsletterName,
  isSubscribed,
  articleTitle,
  comment,
  createdAt,
  quotation,
}: CommentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [needExpansion, setNeedExpansion] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const device = useDevice();
  const isMobile = device === 'mobile';
  const relativeTime = convertRelativeTime(createdAt);

  useEffect(() => {
    if (!quoteRef.current) return;

    const element = quoteRef.current;
    const lineClamp = isMobile ? 3 : 4;
    const lineHeight = parseInt(getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * lineClamp;

    setNeedExpansion(element.scrollHeight > maxHeight);
  }, [quotation, isMobile]);

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
          <QuoteBox>
            <Quote ref={quoteRef} isMobile={isMobile} expanded={expanded}>
              {quotation}
            </Quote>
            {needExpansion && (
              <ControlExpandButton
                variant="transparent"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? '접기' : '더보기'}
              </ControlExpandButton>
            )}
          </QuoteBox>
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

const QuoteBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Quote = styled.div<{ isMobile: boolean; expanded: boolean }>`
  overflow: hidden;
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '4px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.stroke};

  display: -webkit-box;
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile, expanded }) =>
    expanded ? 'unset' : isMobile ? 3 : 4};
  text-overflow: ellipsis;
`;

const ControlExpandButton = styled(Button)`
  padding: 0;

  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  text-decoration: underline;
`;

const Comment = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;
