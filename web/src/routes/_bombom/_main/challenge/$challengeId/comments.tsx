import styled from '@emotion/styled';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import DateFilter from '@/pages/challenge/comments/components/DateFilter';
import MobileCommentsContent from '@/pages/challenge/comments/components/MobileCommentsContent';
import PCCommentsContent from '@/pages/challenge/comments/components/PCCommentsContent';
import { useCommentsFilters } from '@/pages/challenge/comments/hooks/useCommentsFilters';

import { filterWeekdays, formatDate, getDatesInRange } from '@/utils/date';

const CHALLENGE_PERIOD = {
  startDate: '2025-11-05',
  endDate: '2026-02-02',
  totalDays: 31,
};

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
  const today = formatDate(new Date(), '-');
  const latestSelectableDate =
    today < CHALLENGE_PERIOD.endDate ? today : CHALLENGE_PERIOD.endDate;

  const [currentDate, setCurrentDate] = useState(latestSelectableDate);

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/comments',
  });

  const { baseQueryParams, handlePageChange, page, resetPage } =
    useCommentsFilters({
      challengeId: Number(challengeId),
      currentDate,
    });

  const totalDates = getDatesInRange(
    CHALLENGE_PERIOD.startDate,
    latestSelectableDate,
  );

  return (
    <Container>
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
            <AddCommentButton isMobile={isMobile}>
              코멘트 작성하기
            </AddCommentButton>
          </AddCommentBox>
        )}

        {isMobile ? (
          <MobileCommentsContent
            baseQueryParams={baseQueryParams}
            resetPage={resetPage}
          />
        ) : (
          <PCCommentsContent
            baseQueryParams={baseQueryParams}
            onPageChange={handlePageChange}
            page={page}
            resetPage={resetPage}
          />
        )}
      </ContentWrapper>
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
`;
