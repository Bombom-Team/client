import styled from '@emotion/styled';
import { Suspense } from 'react';
import CommentEmptyState from './CommentEmptyState';
import CommentList from './CommentList';
import CommentSkeletonList from './CommentSkeletonList';
import { formatDateToKorean } from '@/utils/date';

const INITIAL_SKELETON_COUNT = 2;

interface CommentDateSectionProps {
  challengeId: number;
  date: string;
  isFirstDay: boolean;
  isToday: boolean;
}

const CommentDateSection = ({
  challengeId,
  date,
  isFirstDay,
  isToday,
}: CommentDateSectionProps) => {
  const dateTitle = formatDateToKorean(new Date(date));

  return (
    <Container data-comment-date-section={date}>
      <DateTitle>{dateTitle}</DateTitle>
      {isFirstDay ? (
        <CommentEmptyState>
          첫날에는 코멘트를 작성하지 않아요!
        </CommentEmptyState>
      ) : (
        <Suspense
          fallback={<CommentSkeletonList count={INITIAL_SKELETON_COUNT} />}
        >
          <CommentList
            challengeId={challengeId}
            date={date}
            isToday={isToday}
          />
        </Suspense>
      )}
    </Container>
  );
};

export default CommentDateSection;

const Container = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const DateTitle = styled.h4`
  width: 100%;
  margin: 4px 0;

  display: flex;
  gap: 8px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  white-space: nowrap;

  &::before,
  &::after {
    height: 1px;

    flex: 1;

    background-color: ${({ theme }) => theme.colors.dividers};

    content: '';
  }
`;
