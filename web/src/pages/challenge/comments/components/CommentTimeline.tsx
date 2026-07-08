import styled from '@emotion/styled';
import { useMemo } from 'react';
import CommentDateSection from './CommentDateSection';
import { useTimelineScrollBehavior } from '../hooks/useTimelineScrollBehavior';
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
    topSentinelRef,
    bottomSentinelRef,
    showTopSentinel,
    showBottomSentinel,
  } = useTimelineScrollBehavior({
    scrollContainerRef,
    challengeId,
    timelineDates,
    initialDate,
    selectedDate,
    onVisibleDateChange,
  });

  return (
    <Container>
      {showTopSentinel && <Sentinel ref={topSentinelRef} />}
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
      {showBottomSentinel && <Sentinel ref={bottomSentinelRef} />}
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

const Sentinel = styled.div`
  width: 100%;
  height: 1px;
`;
