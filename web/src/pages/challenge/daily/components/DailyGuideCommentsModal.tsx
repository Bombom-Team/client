import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import { convertRelativeTime } from '@/pages/challenge/comments/utils/date';
import type { components } from '@/types/openapi';

type DailyGuideCommentItem = components['schemas']['DailyGuideCommentResponse'];

interface DailyGuideCommentsModalProps {
  challengeId: number;
  dayIndex: number;
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
}

const DailyGuideCommentsModal = ({
  challengeId,
  dayIndex,
  modalRef,
  isOpen,
  closeModal,
}: DailyGuideCommentsModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { data: dailyGuideComments, isLoading } = useQuery({
    ...queries.dailyGuideComments({
      challengeId,
      dayIndex,
      size: 50,
      sort: ['createdAt,desc'],
    }),
    enabled: isOpen,
  });

  const comments: DailyGuideCommentItem[] = dailyGuideComments?.content ?? [];
  const totalCount = dailyGuideComments?.totalElements ?? 0;
  const hasComments = comments.length > 0;

  return (
    <Modal
      modalRef={modalRef}
      closeModal={closeModal}
      isOpen={isOpen}
      position={isMobile ? 'bottom' : 'center'}
      showCloseButton={!isMobile}
    >
      <ModalContent isMobile={isMobile}>
        <ModalHeader>
          <ModalTitle isMobile={isMobile}>다른 사람들의 답변</ModalTitle>
          <CountBadge isMobile={isMobile}>총 {totalCount}개</CountBadge>
        </ModalHeader>
        <ModalDescription isMobile={isMobile}>
          같은 질문에 참여한 사람들의 답변을 모았어요.
        </ModalDescription>
        <CommentsWrapper isMobile={isMobile}>
          {isLoading ? (
            <StateText isMobile={isMobile}>답변을 불러오는 중이에요.</StateText>
          ) : !hasComments ? (
            <StateText isMobile={isMobile}>
              아직 작성된 답변이 없어요.
            </StateText>
          ) : (
            <CommentsList>
              {comments.map((comment, index) => (
                <CommentItem
                  key={`${comment.nickname}-${comment.createdAt}-${index}`}
                >
                  <CommentMeta>
                    <Nickname isMobile={isMobile}>{comment.nickname}</Nickname>
                    <Timestamp isMobile={isMobile}>
                      {convertRelativeTime(comment.createdAt)}
                    </Timestamp>
                  </CommentMeta>
                  <CommentText isMobile={isMobile}>
                    {comment.comment}
                  </CommentText>
                </CommentItem>
              ))}
            </CommentsList>
          )}
        </CommentsWrapper>
      </ModalContent>
    </Modal>
  );
};

export default DailyGuideCommentsModal;

const ModalContent = styled.div<{ isMobile: boolean }>`
  width: 100%;
  max-width: 520px;

  display: flex;
  gap: 0.75rem;
  flex-direction: column;

  text-align: left;
`;

const ModalHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModalTitle = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const CountBadge = styled.span<{ isMobile: boolean }>`
  padding: 0.125rem 0.5rem;
  border-radius: 62.4375rem;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.caption : theme.fonts.body3};
`;

const ModalDescription = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const CommentsWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  max-height: ${({ isMobile }) => (isMobile ? '50vh' : '22.5rem')};
  padding: ${({ isMobile }) => (isMobile ? '0.75rem' : '1rem')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;

  background-color: ${({ theme }) => theme.colors.backgroundHover};

  overflow-y: auto;
`;

const CommentsList = styled.ul`
  margin: 0;
  padding: 0;

  display: flex;
  gap: 0.75rem;
  flex-direction: column;

  list-style: none;
`;

const CommentItem = styled.li`
  padding: 1rem;
  border-radius: 0.75rem;

  background-color: ${({ theme }) => theme.colors.white};
`;

const CommentMeta = styled.div`
  margin-bottom: 0.5rem;

  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Nickname = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const Timestamp = styled.time<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.caption : theme.fonts.body3};
`;

const CommentText = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  line-height: 1.6;
`;

const StateText = styled.p<{ isMobile: boolean }>`
  width: 100%;
  min-height: 10rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
