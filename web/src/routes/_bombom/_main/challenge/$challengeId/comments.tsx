import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import Button from '@/components/Button/Button';
import { challengeComments } from '@/mocks/datas/challengeComments';
import CommentCard from '@/pages/challenge/comments/components/CommentCard';
import DateFilter from '@/pages/challenge/comments/components/DateFilter';
import { getWeekDates } from '@/pages/challenge/comments/utils/weekDates';
import { formatDate } from '@/utils/date';

const CHALLENGE_PERIOD = {
  startDate: '2025-12-05',
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
  const today = useMemo(() => formatDate(new Date(), '-'), []);
  const lastSelectableDate = useMemo(
    () => (today < CHALLENGE_PERIOD.endDate ? today : CHALLENGE_PERIOD.endDate),
    [today],
  );
  const selectableWeeks = useMemo(
    () => getWeekDates(CHALLENGE_PERIOD.startDate, lastSelectableDate),
    [lastSelectableDate],
  );
  const selectableWeekCount = selectableWeeks.length;
  const todayWeekIndex = useMemo(() => {
    const weekIndex = selectableWeeks.findIndex((week) => week.includes(today));
    if (weekIndex === -1) {
      return Math.max(selectableWeekCount - 1, 0);
    }
    return weekIndex;
  }, [selectableWeeks, selectableWeekCount, today]);

  const [weekIndex, setWeekIndex] = useState(todayWeekIndex);
  const [currentDate, setCurrentDate] = useState<string>(lastSelectableDate);

  const selectWeek = (week: number) => {
    const clampedWeek = Math.min(
      Math.max(week, 1),
      Math.max(selectableWeekCount, 1),
    );
    setWeekIndex(clampedWeek - 1);
    setCurrentDate(selectableWeeks[clampedWeek - 1]?.[0] || lastSelectableDate);
  };

  const selectDate = (date: string) => {
    setCurrentDate(date);
  };

  return (
    <Container>
      <DateFilter
        weekDates={selectableWeeks[weekIndex] || []}
        selectedDate={currentDate}
        currentWeek={weekIndex + 1}
        totalWeeks={selectableWeekCount}
        onWeekSelect={selectWeek}
        onDateSelect={selectDate}
      />

      <ContentWrapper>
        {currentDate === today && (
          <AddCommentBox>
            <AddCommentTitle>
              오늘 읽은 뉴스레터, 한 줄만 남겨요.
            </AddCommentTitle>
            <AddCommentButton>코멘트 작성하기</AddCommentButton>
          </AddCommentBox>
        )}

        <CommentSection>
          <Comments>
            <CommentTitle>내 코멘트</CommentTitle>
            {challengeComments.length > 0 && (
              <CardList>
                <CommentCard {...challengeComments[0]!} />
              </CardList>
            )}
          </Comments>

          <Comments>
            <CommentTitle>전체 코멘트</CommentTitle>
            {challengeComments.length > 0 ? (
              <CardList>
                {challengeComments.map((comment, index) => (
                  <CommentCard key={`my-${index}`} {...comment} />
                ))}
              </CardList>
            ) : (
              <EmptyState>
                아직 작성한 코멘트가 없어요. 가장 먼저 한 줄 평을 남겨보세요!
              </EmptyState>
            )}
          </Comments>
        </CommentSection>
      </ContentWrapper>
    </Container>
  );
}

export default ChallengeComments;

const Container = styled.section`
  width: 100%;
  min-height: 100vh;

  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  width: 100%;
  padding: 24px;

  display: flex;
  gap: 44px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.backgroundHover};
`;

const AddCommentBox = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const AddCommentTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const AddCommentButton = styled(Button)`
  width: 100%;
  font: ${({ theme }) => theme.fonts.body1};
`;

const CardList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const EmptyState = styled.div`
  padding: 32px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;

const CommentSection = styled.article`
  display: flex;
  gap: 28px;
  flex-direction: column;
`;

const Comments = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CommentTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;
