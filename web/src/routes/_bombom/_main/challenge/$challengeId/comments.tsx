import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import AddCommentModalContent from '@/pages/challenge/comments/components/AddCommentModal/AddCommentModalContent';
import DateFilter from '@/pages/challenge/comments/components/DateFilter';
import MobileCommentsContent from '@/pages/challenge/comments/components/MobileCommentsContent';
import PCCommentsContent from '@/pages/challenge/comments/components/PCCommentsContent';
import { useCommentsFilters } from '@/pages/challenge/comments/hooks/useCommentsFilters';

import UserChallengeInfo from '@/pages/challenge/dashboard/components/UserChallengeInfo/UserChallengeInfo';
import { filterWeekdays, formatDate, getDatesInRange } from '@/utils/date';

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

  const { data: memberChallengeProgressInfo } = useQuery(
    queries.memberProgress(Number(challengeId)),
  );

  const today = formatDate(new Date(), '-');

  const { data: candidateArticles = [] } = useQuery(
    queries.challengeCommentCandidateArticles({ date: today }),
  );

  const latestSelectableDate =
    !challengeInfo?.endDate || today <= challengeInfo?.endDate
      ? today
      : challengeInfo?.endDate;

  const [currentDate, setCurrentDate] = useState(latestSelectableDate);

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { baseQueryParams, changePage, page, resetPage } = useCommentsFilters({
    challengeId: Number(challengeId),
    currentDate,
  });

  if (!challengeInfo) return null;

  const totalDates = getDatesInRange(
    challengeInfo?.startDate,
    latestSelectableDate,
  );

  const isFirstDay = currentDate === challengeInfo.startDate;

  return (
    <Container>
      {challengeInfo && memberChallengeProgressInfo && (
        <UserChallengeInfoWrapper>
          <UserChallengeInfo
            challengeInfo={challengeInfo}
            memberChallengeProgressInfo={memberChallengeProgressInfo}
          />
        </UserChallengeInfoWrapper>
      )}
      <FilterWrapper isMobile={isMobile}>
        <DateFilter
          weekdays={filterWeekdays(totalDates)}
          selectedDate={currentDate}
          onDateSelect={setCurrentDate}
        />
      </FilterWrapper>

      <ContentWrapper isMobile={isMobile}>
        {currentDate === today && (
          <AddCommentBox>
            <AddCommentTitle isMobile={isMobile}>
              오늘 읽은 뉴스레터, 한 줄만 남겨요.
            </AddCommentTitle>
            <AddCommentButton
              isMobile={isMobile}
              onClick={openModal}
              disabled={isFirstDay || candidateArticles.length === 0}
            >
              {isFirstDay
                ? '첫날에는 코멘트를 작성할 수 없어요'
                : candidateArticles.length > 0
                  ? '코멘트 작성하기'
                  : '오늘 읽은 뉴스레터가 없어요'}
            </AddCommentButton>
          </AddCommentBox>
        )}

        {isFirstDay ? (
          <FirstDaySection>
            <FirstDayTitle isMobile={isMobile}>전체 코멘트</FirstDayTitle>
            <FirstDayMessage isMobile={isMobile}>
              첫날에는 코멘트를 작성하지 않아요!
            </FirstDayMessage>
          </FirstDaySection>
        ) : isMobile ? (
          <MobileCommentsContent
            baseQueryParams={baseQueryParams}
            resetPage={resetPage}
          />
        ) : (
          <PCCommentsContent
            baseQueryParams={baseQueryParams}
            onPageChange={changePage}
            page={page}
            resetPage={resetPage}
          />
        )}
      </ContentWrapper>

      {candidateArticles.length > 0 && (
        <Modal
          modalRef={modalRef}
          isOpen={isOpen}
          closeModal={closeModal}
          position={device === 'mobile' ? 'bottom' : 'center'}
          showCloseButton={false}
        >
          <AddCommentModalContent
            closeCommentModal={closeModal}
            candidateArticles={candidateArticles}
          />
        </Modal>
      )}
    </Container>
  );
}

export default ChallengeComments;

const Container = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserChallengeInfoWrapper = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;
`;

const FilterWrapper = styled.div<{ isMobile: boolean }>`
  position: ${({ isMobile }) => (isMobile ? 'sticky' : 'static')};
  top: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + env(safe-area-inset-top))`
      : 'auto'};
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '12px 0' : '16px')};
  border-bottom: 2px solid ${({ theme }) => theme.colors.dividers};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '20px 0' : '24px')};
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '32px' : '44px')};
  flex-direction: column;

  background-color: ${({ theme, isMobile }) =>
    isMobile ? 'none' : theme.colors.backgroundHover};
`;

const AddCommentBox = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const AddCommentTitle = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const AddCommentButton = styled(Button)<{ isMobile: boolean }>`
  width: 100%;
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.stroke};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FirstDaySection = styled.section`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const FirstDayTitle = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body1 : theme.fonts.heading6};
`;

const FirstDayMessage = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '24px' : '32px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  text-align: center;
`;
