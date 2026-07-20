import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import AddCommentModalContent from '@/pages/challenge/comments/components/AddCommentModal/AddCommentModalContent';
import CommentTimeline from '@/pages/challenge/comments/components/CommentTimeline';
import MobileDateFilter from '@/pages/challenge/comments/components/DateFilter/MobileDateFilter';
import PCDateFilter from '@/pages/challenge/comments/components/DateFilter/PCDateFilter';
import StreakModalContent from '@/pages/challenge/comments/components/StreakModalContent';
import { useChallengeCommentDates } from '@/pages/challenge/comments/hooks/useChallengeCommentDates';
import NoticeIcon from '#/assets/svg/info-circle.svg';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/comments',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 한 줄 코멘트',
      },
    ],
  }),
  component: ChallengeComments,
});

function ChallengeComments() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/comments',
  });

  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  const {
    today,
    challengeDates,
    initialSelectedDate,
    isRestDay,
    isFirstDay,
    isChallengeDay,
  } = useChallengeCommentDates({
    startDate: challengeInfo?.startDate,
    endDate: challengeInfo?.endDate,
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<{
    startDate: string | null;
    key: number;
  }>({
    startDate: null,
    key: 0,
  });
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const { data: candidateArticles = [] } = useQuery(
    queries.challengeCommentCandidateArticles({ date: today }),
  );

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { modalRef, openModal, closeModal, isOpen } = useModal();
  const {
    modalRef: firstCompletionModalRef,
    openModal: openFirstCompletionModal,
    closeModal: closeFirstCompletionModal,
    isOpen: isFirstCompletionModalOpen,
  } = useModal();

  const activeDate = selectedDate ?? initialSelectedDate;
  const activeTimelineStart = timeline.startDate ?? initialSelectedDate;

  const selectDate = (date: string) => {
    setSelectedDate(date);
    setTimeline((prev) => ({ startDate: date, key: prev.key + 1 }));
  };

  const changeVisibleDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <Container>
      <FilterWrapper isMobile={isMobile}>
        {isMobile ? (
          <MobileDateFilter
            today={today}
            dates={challengeDates}
            selectedDate={activeDate}
            onDateSelect={selectDate}
          />
        ) : (
          <PCDateFilter
            today={today}
            dates={challengeDates}
            selectedDate={activeDate}
            onDateSelect={selectDate}
          />
        )}
      </FilterWrapper>

      <ContentWrapper isMobile={isMobile} ref={contentScrollRef}>
        {activeDate === today && isChallengeDay(today) && (
          <AddCommentBox>
            <AddCommentTitle>
              오늘 읽은 뉴스레터, 한 줄만 남겨요.
            </AddCommentTitle>
            <AddCommentButton
              onClick={openModal}
              disabled={isFirstDay(today) || candidateArticles.length === 0}
            >
              {isFirstDay(today)
                ? '첫날에는 코멘트를 작성하지 않아요!'
                : candidateArticles.length > 0
                  ? '코멘트 작성하기'
                  : '오늘 읽은 뉴스레터가 없어요'}
            </AddCommentButton>
          </AddCommentBox>
        )}

        {isRestDay && (
          <NoticeLabel isMobile={isMobile}>
            <NoticeIcon width={20} height={20} />
            오늘은 휴식일이에요. 코멘트를 작성하지 않아요!
          </NoticeLabel>
        )}
        <CommentTimeline
          key={timeline.key}
          challengeId={Number(challengeId)}
          challengeDates={challengeDates}
          initialDate={activeTimelineStart}
          scrollContainerRef={contentScrollRef}
          selectedDate={activeDate}
          today={today}
          onVisibleDateChange={changeVisibleDate}
        />
      </ContentWrapper>

      {candidateArticles.length > 0 && (
        <Modal
          modalRef={modalRef}
          isOpen={isOpen}
          closeModal={closeModal}
          position={device === 'mobile' ? 'bottom' : 'center'}
          showCloseButton={true}
        >
          <AddCommentModalContent
            closeCommentModal={closeModal}
            candidateArticles={candidateArticles}
            onFirstCompletion={openFirstCompletionModal}
            onAddComplete={() => selectDate(today)}
          />
        </Modal>
      )}

      <Modal
        modalRef={firstCompletionModalRef}
        isOpen={isFirstCompletionModalOpen}
        closeModal={closeFirstCompletionModal}
        position={isMobile ? 'fullscreen' : 'center'}
        showCloseButton={!isMobile}
      >
        <StreakModalContent
          onClose={closeFirstCompletionModal}
          challengeId={Number(challengeId)}
        />
      </Modal>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FilterWrapper = styled.div<{ isMobile: boolean }>`
  position: ${({ isMobile }) => (isMobile ? 'sticky' : 'static')};
  top: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top})`
      : 'auto'};
  z-index: ${({ isMobile, theme }) => (isMobile ? theme.zIndex.panel : 'auto')};
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '12px 0' : '0 0 8px')};
  border-bottom: 2px solid ${({ theme }) => theme.colors.dividers};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  height: ${({ isMobile }) =>
    isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 260px)'};
  min-height: 240px;
  padding: ${({ isMobile }) => (isMobile ? '20px 0' : '24px')};
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '32px' : '44px')};
  flex-direction: column;

  background-color: ${({ theme, isMobile }) =>
    isMobile ? 'none' : theme.colors.backgroundHover};

  overflow-y: auto;
`;

const AddCommentBox = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const AddCommentTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const AddCommentButton = styled(Button)`
  width: 100%;
  font: ${({ theme }) => theme.fonts.t6Regular};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.stroke};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const NoticeLabel = styled.div<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '8px 12px' : '12px 16px')};
  border-radius: 8px;

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;
