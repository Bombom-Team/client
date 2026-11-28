import { isWebView, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import { classifyByUA } from '@/libs/googleAnalytics/useReferrerTracking';
import ExamSheet from '@/pages/literacy-quiz/components/ExamSheet';
import LiteracyScreen from '@/pages/literacy-quiz/components/LiteracyScreen';
import PcExamSheet from '@/pages/literacy-quiz/components/PcExamSheet';
import PcHeader from '@/pages/literacy-quiz/components/PcHeader';
import PcQuizCover from '@/pages/literacy-quiz/components/PcQuizCover';
import PcResultLayout from '@/pages/literacy-quiz/components/PcResultLayout';
import QuizCover from '@/pages/literacy-quiz/components/QuizCover';
import ResultStory from '@/pages/literacy-quiz/components/ResultStory';
import ReviewSheet from '@/pages/literacy-quiz/components/ReviewSheet';
import { LITERACY_PAGE_URL } from '@/pages/literacy-quiz/constants/links';
import { LITERACY_QUESTIONS } from '@/pages/literacy-quiz/constants/questions';
import {
  LITERACY_COLORS,
  LITERACY_FONT_STYLESHEET_URL,
} from '@/pages/literacy-quiz/constants/style';
import { useClaimAttemptsMutation } from '@/pages/literacy-quiz/hooks/useClaimAttemptsMutation';
import { useStartAttemptMutation } from '@/pages/literacy-quiz/hooks/useStartAttemptMutation';
import { useSubmitAnswersMutation } from '@/pages/literacy-quiz/hooks/useSubmitAnswersMutation';
import { useVisitorId } from '@/pages/literacy-quiz/hooks/useVisitorId';
import {
  clearLastResult,
  loadLastResult,
  saveLastResult,
} from '@/pages/literacy-quiz/utils/lastResult';
import { trackLiteracyEvent } from '@/pages/literacy-quiz/utils/trackLiteracyEvent';
import type {
  LiteracyQuizPlatform,
  PostLiteracyQuizSubmissionResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';
import type {
  LeaveReason,
  LiteracyPhase,
} from '@/pages/literacy-quiz/types/literacyQuiz';
import type { SearchSchemaInput } from '@tanstack/react-router';

interface LiteracySearch {
  c?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const PAGE_TITLE = '제1회 봄봄 문해력 평가';
const PAGE_DESCRIPTION =
  '5문항 · 5분. 설명서, 요금표, 법 조항까지 생활 속 글을 얼마나 정확히 읽는지 확인해 보세요.';
const ENTRY_SOURCE_MAX_LENGTH = 50;

const getSearchText = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

const createEmptyPicks = () => LITERACY_QUESTIONS.map((): number[] => []);

export const Route = createFileRoute('/literacy/')({
  validateSearch: (
    search: LiteracySearch & SearchSchemaInput,
  ): LiteracySearch => ({
    c: getSearchText(search.c),
    utm_source: getSearchText(search.utm_source),
    utm_medium: getSearchText(search.utm_medium),
    utm_campaign: getSearchText(search.utm_campaign),
  }),
  head: () => ({
    meta: [
      { title: `봄봄 | ${PAGE_TITLE}` },
      { name: 'description', content: PAGE_DESCRIPTION },
      { property: 'og:title', content: PAGE_TITLE },
      { property: 'og:description', content: PAGE_DESCRIPTION },
      { property: 'og:url', content: LITERACY_PAGE_URL },
      { name: 'twitter:title', content: PAGE_TITLE },
      { name: 'twitter:description', content: PAGE_DESCRIPTION },
    ],
    links: [
      { rel: 'canonical', href: LITERACY_PAGE_URL },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: LITERACY_FONT_STYLESHEET_URL },
    ],
  }),
  component: LiteracyPage,
});

interface Attempt {
  attemptCode: string;
  ranked: boolean;
  startedAt: number;
}

function LiteracyPage() {
  const { c: invitedByCode, utm_source: utmSource } = Route.useSearch();
  const device = useDevice();
  const { isLoggedIn } = useAuth();
  const { visitorId, hasStoredBefore } = useVisitorId();
  const [platform] = useState<LiteracyQuizPlatform>(() =>
    isWebView() ? 'APP' : 'WEB',
  );
  const [entrySource] = useState(() =>
    (utmSource ?? classifyByUA() ?? undefined)?.slice(
      0,
      ENTRY_SOURCE_MAX_LENGTH,
    ),
  );
  // 다른 페이지에 갔다가 돌아오면 마지막 결과를 마지막 장부터 다시 보여 준다.
  // 다른 도전장 링크로 들어왔으면 이전 결과 대신 새 표지를 보여 준다.
  const [savedResult] = useState(() => {
    const saved = loadLastResult();
    if (!saved) return null;
    if (invitedByCode && invitedByCode !== saved.invitedByCode) return null;
    return saved;
  });
  const [phase, setPhase] = useState<LiteracyPhase>(
    savedResult ? 'result' : 'cover',
  );
  const [attempt, setAttempt] = useState<Attempt | null>(() =>
    savedResult
      ? {
          attemptCode: savedResult.attemptCode,
          ranked: savedResult.result.ranked,
          startedAt: 0,
        }
      : null,
  );
  const [picks, setPicks] = useState<number[][]>(
    () => savedResult?.picks ?? createEmptyPicks(),
  );
  const [result, setResult] =
    useState<PostLiteracyQuizSubmissionResponse | null>(
      savedResult?.result ?? null,
    );
  const [isStoryAtLast, setIsStoryAtLast] = useState(!!savedResult);
  const [isNicknameRegistered, setIsNicknameRegistered] = useState(
    savedResult?.isNicknameRegistered ?? false,
  );
  // 이탈 횟수는 PC·휴대폰 시험 화면이 바뀌어도 이어지도록 여기서 센다.
  const [leaveCount, setLeaveCount] = useState(0);
  const leaveCountRef = useRef(0);
  // 한 번 제출을 보낸 뒤에는 답을 고정한다. 응답을 못 받으면 같은 답안으로 '다시 제출'한다.
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const submitMetaRef = useRef({ unansweredCount: 0, leaveCount: 0 });
  const hasTrackedViewRef = useRef(false);
  const hasClaimedRef = useRef(false);

  const isPC = device === 'pc' && platform === 'WEB';
  const attemptCode = attempt?.attemptCode ?? '';

  const { data: summary } = useQuery({
    ...queries.literacyQuizSummary(),
    enabled: phase === 'cover',
  });
  const { data: challenge } = useQuery({
    ...queries.literacyQuizChallenge({ attemptCode: invitedByCode ?? '' }),
    enabled: !!invitedByCode,
  });

  const { mutate: claimAttempts } = useClaimAttemptsMutation();

  const { mutate: startAttempt, isPending: isStarting } =
    useStartAttemptMutation({
      onSuccess: (createdAttempt) => {
        setAttempt({
          attemptCode: createdAttempt.attemptCode,
          ranked: createdAttempt.ranked,
          startedAt: Date.now(),
        });
        setPicks(createEmptyPicks());
        setResult(null);
        setIsNicknameRegistered(false);
        leaveCountRef.current = 0;
        setLeaveCount(0);
        setIsAnswerLocked(false);
        setPhase('exam');
        trackLiteracyEvent('literacy_quiz_start', {
          attemptCode: createdAttempt.attemptCode,
          platform,
          params: { invited: !!invitedByCode, ranked: createdAttempt.ranked },
        });
      },
    });

  const { mutate: submitAnswers, isPending: isSubmitting } =
    useSubmitAnswersMutation({
      attemptCode: attempt?.attemptCode ?? null,
      onSuccess: (submission) => {
        saveLastResult({
          attemptCode,
          invitedByCode: invitedByCode ?? null,
          picks,
          result: submission,
          isNicknameRegistered: false,
        });
        setResult(submission);
        setIsStoryAtLast(false);
        setPhase('result');
        trackLiteracyEvent('literacy_quiz_submit', {
          attemptCode,
          platform,
          params: {
            correct_count: submission.correctCount,
            elapsed_seconds: submission.elapsedSeconds,
            unanswered_count: submitMetaRef.current.unansweredCount,
            leave_count: submitMetaRef.current.leaveCount,
          },
        });
      },
    });

  useEffect(() => {
    if (phase !== 'cover' || hasTrackedViewRef.current) return;
    hasTrackedViewRef.current = true;
    trackLiteracyEvent('literacy_quiz_view', {
      platform,
      params: {
        entry: invitedByCode ? 'challenge' : 'normal',
        invited_by_code: invitedByCode,
      },
    });
  }, [invitedByCode, phase, platform]);

  // 로그인하기 전에 푼 기록을 회원에 이어 붙인다(가입 전환 집계용).
  useEffect(() => {
    if (!isLoggedIn || !hasStoredBefore || hasClaimedRef.current) return;
    hasClaimedRef.current = true;
    claimAttempts({ visitorId });
  }, [claimAttempts, hasStoredBefore, isLoggedIn, visitorId]);

  const handleStart = () => {
    clearLastResult();
    startAttempt({
      visitorId,
      invitedByCode,
      entrySource,
      platform,
    });
  };

  const handlePick = useCallback(
    (questionIndex: number, choice: number) => {
      if (isAnswerLocked) return;
      const question = LITERACY_QUESTIONS[questionIndex];
      setPicks((current) =>
        current.map((picked, index) => {
          if (index !== questionIndex) return picked;
          const isPicked = picked.includes(choice);
          if (question?.isMulti) {
            return isPicked
              ? picked.filter((number) => number !== choice)
              : [...picked, choice].sort((a, b) => a - b);
          }
          return isPicked ? [] : [choice];
        }),
      );
    },
    [isAnswerLocked],
  );

  const handleLeave = useCallback(
    (reason: LeaveReason) => {
      leaveCountRef.current += 1;
      setLeaveCount(leaveCountRef.current);
      trackLiteracyEvent('literacy_quiz_leave_screen', {
        attemptCode,
        platform,
        params: { leave_count: leaveCountRef.current, reason },
      });
    },
    [attemptCode, platform],
  );

  const handleSubmit = () => {
    submitMetaRef.current = {
      unansweredCount: picks.filter((picked) => picked.length === 0).length,
      leaveCount: leaveCountRef.current,
    };
    setIsAnswerLocked(true);
    submitAnswers({ visitorId, answers: picks });
  };

  const isSubmitRetry = isAnswerLocked && !isSubmitting;

  const handleReviewOpen = () => {
    trackLiteracyEvent('literacy_quiz_review_open', { attemptCode, platform });
    setPhase('review');
  };

  // 결과 화면의 ×: 저장된 결과를 지우고 표지로 돌아가 다시 풀 수 있게 한다(다시 푼 기록은 순위 제외).
  const handleRestart = () => {
    trackLiteracyEvent('literacy_quiz_restart_click', {
      attemptCode,
      platform,
    });
    clearLastResult();
    setIsStoryAtLast(false);
    setPhase('cover');
  };

  const handleReviewBack = () => {
    setIsStoryAtLast(true);
    setPhase('result');
  };

  const renderResult = () => {
    if (!result || !attempt) return null;
    if (phase === 'review') {
      return (
        <ReviewSheet
          picks={picks}
          correctCount={result.correctCount}
          questionResults={result.questions}
          onBack={handleReviewBack}
        />
      );
    }
    return (
      <ResultStory
        result={result}
        attemptCode={attempt.attemptCode}
        visitorId={visitorId}
        platform={platform}
        startAtLast={isStoryAtLast}
        isNicknameRegistered={isNicknameRegistered}
        onReview={handleReviewOpen}
        onRestart={handleRestart}
      />
    );
  };

  if (isPC) {
    return (
      <PcPage>
        <PcHeader />
        {phase === 'cover' && (
          <PcQuizCover
            summary={summary}
            challenge={challenge}
            isStarting={isStarting}
            onStart={handleStart}
          />
        )}
        {phase === 'exam' && attempt && (
          <PcExamSheet
            picks={picks}
            startedAt={attempt.startedAt}
            leaveCount={leaveCount}
            isSubmitting={isSubmitting}
            isRetry={isSubmitRetry}
            onPick={handlePick}
            onSubmit={handleSubmit}
            onLeave={handleLeave}
          />
        )}
        {(phase === 'result' || phase === 'review') && (
          <PcResultLayout>{renderResult()}</PcResultLayout>
        )}
      </PcPage>
    );
  }

  return (
    <MobilePage>
      <LiteracyScreen>
        {phase === 'cover' && (
          <QuizCover
            summary={summary}
            challenge={challenge}
            isStarting={isStarting}
            onStart={handleStart}
          />
        )}
        {phase === 'exam' && attempt && (
          <ExamSheet
            picks={picks}
            startedAt={attempt.startedAt}
            leaveCount={leaveCount}
            isSubmitting={isSubmitting}
            isRetry={isSubmitRetry}
            onPick={handlePick}
            onSubmit={handleSubmit}
            onLeave={handleLeave}
          />
        )}
        {(phase === 'result' || phase === 'review') && renderResult()}
      </LiteracyScreen>
    </MobilePage>
  );
}

const MobilePage = styled.main`
  overflow: hidden;
  width: 100%;
  height: 100dvh;

  background: ${LITERACY_COLORS.desk};

  overscroll-behavior: none;

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition: none !important;
    }
  }
`;

const PcPage = styled.main`
  overflow: hidden;
  width: 100%;
  height: 100dvh;

  display: flex;
  flex-direction: column;

  background: ${LITERACY_COLORS.desk};

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition: none !important;
    }
  }
`;
