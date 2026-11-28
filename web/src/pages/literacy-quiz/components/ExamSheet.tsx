import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ChoiceButtons from './ChoiceButtons';
import CopyBlockedNotice from './CopyBlockedNotice';
import ExamLayout from './ExamLayout';
import ExamShield from './ExamShield';
import PaperHeader from './PaperHeader';
import PaperQuestion from './PaperQuestion';
import UnansweredSheet from './UnansweredSheet';
import { AUTO_SCROLL_DELAY_MS } from '../constants/exam';
import { LITERACY_QUESTIONS } from '../constants/questions';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useExamProtection } from '../hooks/useExamProtection';
import { useExamTimer } from '../hooks/useExamTimer';
import { formatRemaining, getTimerState } from '../utils/formatTime';
import type { LeaveReason, TimerState } from '../types/literacyQuiz';

interface ExamSheetProps {
  picks: number[][];
  startedAt: number;
  leaveCount: number;
  isSubmitting: boolean;
  isRetry: boolean;
  onPick: (questionIndex: number, choice: number) => void;
  onSubmit: () => void;
  onLeave: (reason: LeaveReason) => void;
}

// 휴대폰 풀이 화면(수능 시험지형). 5분이 지나도 '+0:12'처럼 계속 풀 수 있다.
const ExamSheet = ({
  picks,
  startedAt,
  leaveCount,
  isSubmitting,
  isRetry,
  onPick,
  onSubmit,
  onLeave,
}: ExamSheetProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [unansweredNumbers, setUnansweredNumbers] = useState<number[] | null>(
    null,
  );
  const elapsedSeconds = useExamTimer(startedAt);
  const { shieldReason, noticeMessage, dismissShield } = useExamProtection({
    isEnabled: true,
    containerRef,
    onLeave,
  });

  const answeredCount = picks.filter((picked) => picked.length > 0).length;
  const timerState = getTimerState(elapsedSeconds);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const scrollToQuestion = (questionIndex: number) => {
    questionRefs.current[questionIndex]?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const handlePick = (questionIndex: number, choice: number) => {
    const question = LITERACY_QUESTIONS[questionIndex];
    const isPickingNew = !picks[questionIndex]?.includes(choice);
    onPick(questionIndex, choice);

    const isLastQuestion = questionIndex >= LITERACY_QUESTIONS.length - 1;
    if (question?.isMulti || !isPickingNew || isLastQuestion) return;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(
      () => scrollToQuestion(questionIndex + 1),
      AUTO_SCROLL_DELAY_MS,
    );
  };

  const handleSubmitClick = () => {
    // 제출 응답을 못 받았으면 같은 답안으로 다시 제출한다. 서버는 이미 받은 제출이면 저장된 결과를 준다.
    if (isRetry) {
      onSubmit();
      return;
    }
    const emptyNumbers = picks
      .map((picked, index) => (picked.length > 0 ? null : index + 1))
      .filter((number): number is number => number !== null);

    if (emptyNumbers.length > 0) {
      setUnansweredNumbers(emptyNumbers);
      return;
    }
    onSubmit();
  };

  const handleSheetBack = () => {
    const firstEmptyNumber = unansweredNumbers?.[0];
    setUnansweredNumbers(null);
    if (firstEmptyNumber) scrollToQuestion(firstEmptyNumber - 1);
  };

  const handleSheetSubmit = () => {
    setUnansweredNumbers(null);
    onSubmit();
  };

  return (
    <ExamLayout
      containerRef={containerRef}
      title="봄봄 문해력 평가"
      topAside={
        <TimeBox role="timer" aria-label="남은 시간">
          <TimeLabel>남은 시간</TimeLabel>
          <TimeValueCell>
            <TimeValue timerState={timerState}>
              {formatRemaining(elapsedSeconds)}
            </TimeValue>
          </TimeValueCell>
        </TimeBox>
      }
      topExtra={
        <Progress aria-label={`답안 표기 ${answeredCount}/5`}>
          {picks.map((picked, index) => (
            <ProgressBar key={index} isOn={picked.length > 0} />
          ))}
          <ProgressCount>{answeredCount}/5</ProgressCount>
        </Progress>
      }
      bottomLabel={`답안 표기 ${answeredCount}/5`}
      buttonLabel={isRetry ? '다시 제출' : '답안 제출'}
      onButtonClick={handleSubmitClick}
      isButtonDisabled={isSubmitting}
      isBlurred={shieldReason !== null}
      isBackgroundInert={shieldReason !== null || unansweredNumbers !== null}
      isProtected
      overlay={
        <>
          {unansweredNumbers && (
            <UnansweredSheet
              unansweredNumbers={unansweredNumbers}
              size="mobile"
              onBack={handleSheetBack}
              onSubmit={handleSheetSubmit}
            />
          )}
          {shieldReason && (
            <ExamShield
              reason={shieldReason}
              leaveCount={leaveCount}
              size="mobile"
              onContinue={dismissShield}
            />
          )}
          {noticeMessage && (
            <CopyBlockedNotice message={noticeMessage} size="mobile" />
          )}
        </>
      }
    >
      <PaperHeader />
      {LITERACY_QUESTIONS.map((question, index) => (
        <PaperQuestion
          key={question.stemHtml}
          index={index}
          question={question}
          questionRef={(element) => {
            questionRefs.current[index] = element;
          }}
        >
          <ChoiceButtons
            questionNumber={index + 1}
            choices={question.choices}
            picked={picks[index] ?? []}
            onPick={(choice) => handlePick(index, choice)}
          />
        </PaperQuestion>
      ))}
    </ExamLayout>
  );
};

export default ExamSheet;

const TIMER_COLORS: Record<TimerState, string> = {
  normal: LITERACY_COLORS.ink,
  warn: LITERACY_COLORS.brandDeep,
  over: LITERACY_COLORS.stamp,
};

const TimeBox = styled.span`
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  font: 700 2.8cqw ${LITERACY_FONTS.head};

  grid-template-columns: auto auto;
`;

const TimeLabel = styled.span`
  padding: 1.2cqw 2cqw;
  border-right: 1.5px solid ${LITERACY_COLORS.ink};

  background: ${LITERACY_COLORS.paperLabel};
`;

const TimeValueCell = styled.span`
  padding: 1.2cqw 2cqw;
`;

const TimeValue = styled.b<{ timerState: TimerState }>`
  color: ${({ timerState }) => TIMER_COLORS[timerState]};
  font: 400 4.2cqw/1 ${LITERACY_FONTS.display};

  font-variant-numeric: tabular-nums;
`;

const Progress = styled.div`
  display: flex;
  gap: 1.6cqw;
  align-items: center;

  color: ${LITERACY_COLORS.sub};
  font: 700 2.8cqw ${LITERACY_FONTS.head};
`;

const ProgressBar = styled.i<{ isOn: boolean }>`
  height: 0.8cqw;

  flex: 1;

  background: ${({ isOn }) =>
    isOn ? LITERACY_COLORS.ink : LITERACY_COLORS.progressOff};
`;

const ProgressCount = styled.span``;
