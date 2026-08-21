import styled from '@emotion/styled';
import { useRef } from 'react';
import CommentDateSection from './CommentDateSection';
import { useTimeline } from '../hooks/useTimeline';
import { useTimelineBottomSpacer } from '../hooks/useTimelineBottomSpacer';
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
  const firstChallengeDate = challengeDates[0];

  const {
    visibleDates,
    newerDateTriggerRef,
    olderDateTriggerRef,
    canShowNewerDateTrigger,
    canShowOlderDateTrigger,
  } = useTimeline({
    scrollContainerRef,
    challengeId,
    challengeDates,
    initialDate,
    selectedDate,
    onVisibleDateChange,
  });

  const sectionListRef = useRef<HTMLDivElement>(null);
  const spacerHeight = useTimelineBottomSpacer({
    scrollContainerRef,
    sectionListRef,
    visibleDates,
  });

  return (
    <Container>
      {canShowNewerDateTrigger && <LoadMoreTrigger ref={newerDateTriggerRef} />}
      <SectionList ref={sectionListRef}>
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
      {canShowOlderDateTrigger && <LoadMoreTrigger ref={olderDateTriggerRef} />}
      <BottomSpacer height={spacerHeight} aria-hidden />
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

const BottomSpacer = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => height}px;

  flex-shrink: 0;
`;
