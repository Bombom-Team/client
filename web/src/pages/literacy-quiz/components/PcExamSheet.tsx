import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useMemo, useRef, useState } from 'react';
import CopyBlockedNotice from './CopyBlockedNotice';
import ExamShield from './ExamShield';
import PcPaperQuestion from './PcPaperQuestion';
import UnansweredSheet from './UnansweredSheet';
import { LITERACY_QUESTIONS } from '../constants/questions';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useExamKeyboard } from '../hooks/useExamKeyboard';
import { useExamProtection } from '../hooks/useExamProtection';
import { useExamTimer } from '../hooks/useExamTimer';
import { formatRemaining, getTimerState } from '../utils/formatTime';
import type { LeaveReason, TimerState } from '../types/literacyQuiz';

interface PcExamSheetProps {
  picks: number[][];
  startedAt: number;
  leaveCount: number;
  isSubmitting: boolean;
  isRetry: boolean;
  onPick: (questionIndex: number, choice: number) => void;
  onSubmit: () => void;
  onLeave: (reason: LeaveReason) => void;
}

const TIMER_COLORS: Record<TimerState, string> = {
  normal: LITERACY_COLORS.ink,
  warn: LITERACY_COLORS.brandDeep,
  over: LITERACY_COLORS.stamp,
};

// PC 풀이 화면: 2단 문제지 + 오른쪽 답안지(OMR). 숫자키 1~4로 고르고 Enter로 다음 문항.
const PcExamSheet = ({
  picks,
  startedAt,
  leaveCount,
  isSubmitting,
  isRetry,
  onPick,
  onSubmit,
  onLeave,
}: PcExamSheetProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
  const choiceCounts = useMemo(
    () => LITERACY_QUESTIONS.map((question) => question.choices.length),
    [],
  );

  const scrollToQuestion = useCallback(
    (questionIndex: number) => {
      questionRefs.current[questionIndex]?.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [shouldReduceMotion],
  );

  const handleKeyboardPick = useCallback(
    (questionIndex: number, choice: number) => {
      onPick(questionIndex, choice);
      scrollToQuestion(questionIndex);
    },
    [onPick, scrollToQuestion],
  );

  const moveToQuestion = useCallback(
    (questionIndex: number) => {
      setCurrentIndex(questionIndex);
      scrollToQuestion(questionIndex);
    },
    [scrollToQuestion],
  );

  useExamKeyboard({
    isEnabled: shieldReason === null && unansweredNumbers === null,
    currentIndex,
    choiceCounts,
    onPick: handleKeyboardPick,
    onMove: moveToQuestion,
  });

  const handlePaperPick = (questionIndex: number, choice: number) => {
    setCurrentIndex(questionIndex);
    onPick(questionIndex, choice);
  };

  const handleBubbleClick = (questionIndex: number, choice: number) => {
    onPick(questionIndex, choice);
    moveToQuestion(questionIndex);
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
    if (firstEmptyNumber) moveToQuestion(firstEmptyNumber - 1);
  };

  const handleSheetSubmit = () => {
    setUnansweredNumbers(null);
    onSubmit();
  };

  const isBlurred = shieldReason !== null;
  const isBackgroundInert = isBlurred || unansweredNumbers !== null;

  return (
    <Container ref={containerRef}>
      <Paper isBlurred={isBlurred} inert={isBackgroundInert}>
        <PaperHead>
          <PaperCaption>제1회 봄봄 문해력 평가 문제지</PaperCaption>
          <PaperSubject>읽기 영역</PaperSubject>
        </PaperHead>
        <Columns>
          {LITERACY_QUESTIONS.map((question, index) => (
            <PcPaperQuestion
              key={question.stemHtml}
              index={index}
              question={question}
              picked={picks[index] ?? []}
              questionRef={(element) => {
                questionRefs.current[index] = element;
              }}
              onPick={(choice) => handlePaperPick(index, choice)}
            />
          ))}
        </Columns>
      </Paper>
      <AnswerSheet
        isBlurred={isBlurred}
        inert={isBackgroundInert}
        aria-label="답안지"
      >
        <TimeBox role="timer" aria-label="남은 시간">
          <TimeLabel>남은 시간</TimeLabel>
          <TimeValue timerState={timerState}>
            {formatRemaining(elapsedSeconds)}
          </TimeValue>
        </TimeBox>
        <AnswerTitle>답 안 지</AnswerTitle>
        {LITERACY_QUESTIONS.map((question, questionIndex) => (
          <AnswerRow
            key={question.stemHtml}
            isCurrent={questionIndex === currentIndex}
          >
            <AnswerNumber>{questionIndex + 1}</AnswerNumber>
            {question.choices.map((choice, choiceIndex) => {
              const choiceNumber = choiceIndex + 1;
              const isOn =
                picks[questionIndex]?.includes(choiceNumber) ?? false;
              return (
                <Bubble
                  key={choice}
                  type="button"
                  isOn={isOn}
                  aria-pressed={isOn}
                  aria-label={`${questionIndex + 1}번 ${choiceNumber}번 보기`}
                  onClick={() => handleBubbleClick(questionIndex, choiceNumber)}
                >
                  {choiceNumber}
                </Bubble>
              );
            })}
          </AnswerRow>
        ))}
        <AnswerCount>{answeredCount} / 5 표기</AnswerCount>
        <SubmitButton
          type="button"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
          data-keep-enter
        >
          {isRetry ? '다시 제출' : '답안 제출'}
        </SubmitButton>
        <KeyboardHint>숫자키 1~4 · Enter 다음</KeyboardHint>
      </AnswerSheet>
      {unansweredNumbers && (
        <UnansweredSheet
          unansweredNumbers={unansweredNumbers}
          size="pc"
          onBack={handleSheetBack}
          onSubmit={handleSheetSubmit}
        />
      )}
      {shieldReason && (
        <ExamShield
          reason={shieldReason}
          leaveCount={leaveCount}
          size="pc"
          onContinue={dismissShield}
        />
      )}
      {noticeMessage && <CopyBlockedNotice message={noticeMessage} size="pc" />}
    </Container>
  );
};

export default PcExamSheet;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  padding: 24px 28px 0;

  display: grid;
  gap: 24px;
  flex: 1;

  grid-template-columns: 1fr 252px;
`;

const Paper = styled.div<{ isBlurred: boolean }>`
  padding: 28px 36px 40px;
  box-shadow: 0 1px 6px rgb(0 0 0 / 12%);

  background: ${LITERACY_COLORS.paper};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.serif};

  filter: ${({ isBlurred }) => (isBlurred ? 'blur(16px)' : 'none')};
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-touch-callout: none;
  user-select: none;

  @media print {
    visibility: hidden;
  }
`;

const PaperHead = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 3px double ${LITERACY_COLORS.ink};

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: ${LITERACY_FONTS.head};
`;

const PaperCaption = styled.small`
  font: 700 14px ${LITERACY_FONTS.head};
`;

const PaperSubject = styled.b`
  padding: 4px 10px 4px 18px;
  border: 2px solid ${LITERACY_COLORS.ink};

  font: 700 24px ${LITERACY_FONTS.head};
  letter-spacing: 0.3em;
`;

const Columns = styled.div`
  column-count: 2;
  column-gap: 68px;
  column-rule: 1.5px solid ${LITERACY_COLORS.ink};
`;

const AnswerSheet = styled.aside<{ isBlurred: boolean }>`
  padding: 16px;
  border: 2px solid ${LITERACY_COLORS.ink};

  display: grid;
  gap: 10px;
  align-self: start;

  background: ${LITERACY_COLORS.paper};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.head};

  filter: ${({ isBlurred }) => (isBlurred ? 'blur(16px)' : 'none')};
`;

const TimeBox = styled.div`
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  font: 700 13px ${LITERACY_FONTS.head};

  grid-template-columns: auto 1fr;
`;

const TimeLabel = styled.span`
  padding: 8px 10px;
  border-right: 1.5px solid ${LITERACY_COLORS.ink};

  background: ${LITERACY_COLORS.paperLabel};
`;

const TimeValue = styled.b<{ timerState: TimerState }>`
  padding: 4px 10px;

  color: ${({ timerState }) => TIMER_COLORS[timerState]};
  font: 400 24px/1.3 ${LITERACY_FONTS.display};
  text-align: center;

  font-variant-numeric: tabular-nums;
`;

const AnswerTitle = styled.h4`
  margin: 6px 0 0;

  font: 900 15px ${LITERACY_FONTS.head};
  letter-spacing: 0.4em;
  text-align: center;
`;

const AnswerRow = styled.div<{ isCurrent: boolean }>`
  padding: 4px 0;
  border-top: 1px solid ${LITERACY_COLORS.paperLine};

  display: grid;
  gap: 6px;
  align-items: center;

  background: ${({ isCurrent }) =>
    isCurrent ? LITERACY_COLORS.paperLabel : 'transparent'};

  grid-template-columns: 24px repeat(4, 1fr);
`;

const AnswerNumber = styled.span`
  font: 400 15px ${LITERACY_FONTS.display};
  text-align: center;
`;

const Bubble = styled.button<{ isOn: boolean }>`
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1.5px solid
    ${({ isOn }) => (isOn ? LITERACY_COLORS.ink : LITERACY_COLORS.omrBubble)};
  border-radius: 50%;

  display: grid;
  justify-self: center;

  background: ${({ isOn }) => (isOn ? LITERACY_COLORS.ink : 'transparent')};
  color: ${({ isOn, theme }) => (isOn ? theme.colors.white : LITERACY_COLORS.sub)};
  font: 700 13px ${LITERACY_FONTS.head};

  cursor: pointer;
  place-items: center;
`;

const AnswerCount = styled.p`
  margin: 0;

  color: ${LITERACY_COLORS.sub};
  font: 700 13px ${LITERACY_FONTS.head};
  text-align: center;
`;

const SubmitButton = styled.button`
  padding: 16px;
  border: 0;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 700 18px ${LITERACY_FONTS.head};
  letter-spacing: 0.08em;

  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`;

const KeyboardHint = styled.small`
  color: ${LITERACY_COLORS.sub};
  font-size: 12px;
  text-align: center;
`;
