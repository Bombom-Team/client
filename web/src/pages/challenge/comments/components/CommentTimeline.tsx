import styled from '@emotion/styled';
import { useMemo } from 'react';
import CommentDateSection from './CommentDateSection';
import { useTimeline } from '../hooks/useTimeline';
import type { RefObject } from 'react';

interface CommentTimelineProps {
  challengeId: number;
  challengeDates: string[];
  initialDate: string;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  selectedDate: string;
  today: string;
  onVisibleDateChange: (date: string) => void;
}

const CommentTimeline = ({
  challengeId,
  challengeDates,
  initialDate,
  scrollContainerRef,
  selectedDate,
  today,
  onVisibleDateChange,
}: CommentTimelineProps) => {
  const timelineDates = useMemo(
    () => [...challengeDates].reverse(),
    [challengeDates],
  );
  const firstChallengeDate = challengeDates[0];

  const {
    visibleDates,
    newerTimelineRef,
    olderTimelineRef,
    canShowNewerTimeline,
    canShowOlderTimeline,
  } = useTimeline({
    scrollContainerRef,
    challengeId,
    timelineDates,
    initialDate,
    selectedDate,
    onVisibleDateChange,
  });

  return (
    <Container>
      {canShowNewerTimeline && <LoadMoreTrigger ref={newerTimelineRef} />}
      <SectionList>
        {visibleDates.map((date) => (
          <CommentDateSection
            key={date}
            challengeId={challengeId}
            date={date}
            isFirstDay={date === firstChallengeDate}
            isToday={date === today}
          />
        ))}
      </SectionList>
      {canShowOlderTimeline && <LoadMoreTrigger ref={olderTimelineRef} />}
    </Container>
  );
};

export default CommentTimeline;

const Container = styled.section`
  min-height: 240px;
`;

const SectionList = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`;
