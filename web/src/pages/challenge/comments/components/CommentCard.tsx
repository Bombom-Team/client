import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { Suspense } from 'react';
import useExpandQuotation from '../hooks/useExpandQuotation';
import useReplyAccordion from '../hooks/useReplyAccordion';
import EditCommentModalContent from './EditCommentModal/EditCommentModalContent';
import ReplyList from './ReplyList';
import ReplyWriter from './ReplyWriter';
import { MAX_QUOTATION_LINE } from '../constants/comment';
import { useAddCommentLikeMutation } from '../hooks/useAddCommentLikeMutation';
import { useDeleteCommentLikeMutation } from '../hooks/useDeleteCommentLikeMutation';
import { useUpdateChallengeCommentMutation } from '../hooks/useUpdateChallengeCommentMutation';
import { convertRelativeTime } from '../utils/date';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex/Flex';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Comment } from '../types/comment';
import CheckIcon from '#/assets/svg/check-circle.svg';
import EditIcon from '#/assets/svg/edit.svg';
import HeartFilledIcon from '#/assets/svg/heart-filled.svg';
import HeartIcon from '#/assets/svg/heart.svg';
import MailIcon from '#/assets/svg/mail.svg';

type CommentCardProps = Comment & {
  challengeId: number;
};

const DELETED_USER_NICKNAME = '탈퇴한 회원';

const CommentCard = ({
  nickname,
  newsletterName,
  isSubscribed,
  articleTitle,
  comment,
  createdAt,
  quotation,
  commentId,
  isMyComment,
  challengeId,
  likeCount,
  isLiked,
  replyCount,
}: CommentCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const relativeTime = convertRelativeTime(createdAt);
  const { modalRef, openModal, closeModal, isOpen } = useModal();
  const { isReplyOpen, toggleReplyAccordion, hasReplies } = useReplyAccordion({
    replyCount,
  });

  const { mutate: updateChallengeComment } = useUpdateChallengeCommentMutation({
    challengeId,
  });

  const editPostedComment = (newComment: string) => {
    updateChallengeComment({ challengeId, commentId, comment: newComment });
  };

  const { mutate: addCommentLike } = useAddCommentLikeMutation({
    challengeId,
    commentId,
  });

  const { mutate: deleteCommentLike } = useDeleteCommentLikeMutation({
    challengeId,
    commentId,
  });

  const toggleLike = () => {
    if (isLiked) {
      deleteCommentLike();
    } else {
      addCommentLike();
    }
  };

  const { expanded, needExpansion, quoteRef, toggleExpanded } =
    useExpandQuotation({
      quotation,
      maxLines: isMobile
        ? MAX_QUOTATION_LINE.mobile
        : MAX_QUOTATION_LINE.default,
    });

  return (
    <>
      <Container isMobile={isMobile} isMyComment={isMyComment}>
        <Flex gap={12} align="center" justify="space-between">
          <Flex direction="column" gap={4}>
            <Flex gap={isMobile ? 4 : 8} wrap="wrap" align="center">
              <Text color="textSecondary" font={isMobile ? 't3Regular' : 't5Regular'}>
                {nickname ?? DELETED_USER_NICKNAME} · {relativeTime}
              </Text>
              <NewsletterBadge
                isMobile={isMobile}
                text={newsletterName}
                {...(isSubscribed && {
                  icon: (
                    <CheckIcon
                      width={16}
                      height={16}
                      fill={theme.colors.primary}
                    />
                  ),
                })}
              />
            </Flex>
            <Flex gap={4} align="center">
              <MailIcon
                width={16}
                height={16}
                color={theme.colors.textSecondary}
              />
              <Text
                as="p"
                color="textTertiary"
                font={isMobile ? 't3Regular' : 't5Regular'}
              >
                {articleTitle}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={8} align="flex-start">
            {isMyComment && (
              <EditButton
                variant="transparent"
                onClick={openModal}
                isMobile={isMobile}
              >
                <EditIcon fill={theme.colors.textSecondary} />
              </EditButton>
            )}
            <LikeButton
              variant="transparent"
              onClick={toggleLike}
              isMobile={isMobile}
            >
              {isLiked ? (
                <HeartFilledIcon fill={theme.colors.red} />
              ) : (
                <HeartIcon color={theme.colors.red} />
              )}
              <Text
                color={isLiked ? 'red' : 'textSecondary'}
                font={isMobile ? 't3Regular' : 't5Regular'}
              >
                {likeCount}
              </Text>
            </LikeButton>
          </Flex>
        </Flex>
        <Flex gap={isMobile ? 4 : 8} direction="column">
          {quotation && (
            <Quote ref={quoteRef} isMobile={isMobile} expanded={expanded}>
              {quotation}
              {needExpansion &&
                (!expanded ? (
                  <ExpandQuoteButton
                    isMobile={isMobile}
                    variant="transparent"
                    onClick={toggleExpanded}
                  >
                    더보기
                  </ExpandQuoteButton>
                ) : (
                  <HideQuoteButton
                    isMobile={isMobile}
                    variant="transparent"
                    onClick={toggleExpanded}
                  >
                    접기
                  </HideQuoteButton>
                ))}
            </Quote>
          )}
          <Text as="p">{comment}</Text>
        </Flex>
        <ReplyWriter challengeId={challengeId} commentId={commentId} />
        {hasReplies && isReplyOpen && (
          <Flex gap={isMobile ? 8 : 12} direction="column">
            <Suspense fallback={<ReplyList.Loading />}>
              <ReplyList
                challengeId={challengeId}
                commentId={commentId}
                replyCount={replyCount}
              />
            </Suspense>
          </Flex>
        )}
        {hasReplies && (
          <ReplyAccordion
            type="button"
            onClick={toggleReplyAccordion}
            aria-expanded={isReplyOpen}
          >
            <Text>
              {isReplyOpen ? '답글 접기' : `답글 ${replyCount}개 더보기`}
            </Text>
            <ChevronIcon
              direction={isReplyOpen ? 'up' : 'down'}
              width={16}
              height={16}
            />
          </ReplyAccordion>
        )}
      </Container>

      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        position={isMobile ? 'bottom' : 'center'}
        showCloseButton={false}
      >
        <EditCommentModalContent
          closeModal={closeModal}
          postedComment={comment}
          articleTitle={articleTitle}
          newsletterName={newsletterName}
          quotation={quotation}
          onEdit={editPostedComment}
        />
      </Modal>
    </>
  );
};

export default CommentCard;

const Container = styled.article<{ isMobile: boolean; isMyComment: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-bottom: ${({ theme, isMyComment }) =>
    isMyComment ? `4px solid ${theme.colors.primaryLight}` : 'none'};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const LikeButton = styled(Button)<{ isMobile: boolean }>`
  padding: 0;

  display: flex;
  gap: 0;
  flex-direction: column;
  align-items: center;

  svg {
    width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
    height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  }

  &:hover {
    background: none;

    svg {
      color: ${({ theme }) => theme.colors.red};
    }
  }
`;

const NewsletterBadge = styled(Badge)<{ isMobile: boolean }>`
  padding: 2px 6px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t3Regular : theme.fonts.t5Regular};
`;

const EditButton = styled(Button)<{ isMobile: boolean }>`
  padding: 0;

  svg {
    width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
    height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  }

  &:hover {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Quote = styled.div<{ isMobile: boolean; expanded: boolean }>`
  overflow: hidden;
  position: relative;
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '4px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.stroke};

  display: ${({ expanded }) => (expanded ? 'block' : '-webkit-box')};
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t3Regular : theme.fonts.t5Regular};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile, expanded }) => {
    if (expanded) return 'unset';
    if (isMobile) return MAX_QUOTATION_LINE.mobile;
    return MAX_QUOTATION_LINE.default;
  }};
`;

const ExpandButton = styled(Button)<{ isMobile: boolean }>`
  padding: 0;

  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t3Regular : theme.fonts.t5Regular};

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

const ReplyAccordion = styled.button`
  padding: 0;
  border: none;

  display: inline-flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;

  background: transparent;

  cursor: pointer;
`;
