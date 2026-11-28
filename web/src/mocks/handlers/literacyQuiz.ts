import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import { createStorage } from '@/utils/localStorage';

const baseURL = `${ENV.baseUrl}/literacy-quiz`;

// 정답과 해설은 서버(여기서는 목 핸들러)에만 둔다. 웹 화면 코드에는 넣지 않는다.
const ANSWER_KEYS = [[1], [1, 3], [3], [2], [4]];
const CHOICE_COUNTS = [3, 3, 4, 4, 4];
const EXPLANATIONS = [
  '정답 ① · 고령자는 ‘먹기 전에 의사나 약사와 상의’하라고 했으니 서연이 맞습니다. 민지는 ‘운전하지 마십시오’, 준호는 ‘해열진통제와 함께 먹지 마십시오’를 어겼습니다.',
  '정답 ①, ③ · 도착 정보가 없는 정류장을 떠나 택시 승강장으로 갔으니 ①, 우산을 고쳐 쓰고 빗줄기가 ‘가늘어졌다’고 했으니 ③입니다. ②는 그럴듯하지만 글에 근거가 없습니다. 두 개를 다 골라야 정답입니다.',
  '정답 ③ · 경로 할인은 토·일·공휴일엔 안 돼서 토요일·일요일 모두 할머니는 정가예요. 손녀만 어린이 할인을 받아 편도 54,400 + 27,200 = 81,600원, 왕복이면 163,200원이에요. 편도만 계산하면 ①, 할머니도 할인받는다고 보면 ②, 손녀 할인까지 놓치면 ④가 돼요.',
  '정답 ② · 최초 1년을 넘긴 근속은 24년이고, 2년마다 1일씩 붙으니 12일이 가산돼 15 + 12 = 27일이에요. 그런데 ④항 끝에 ‘총 휴가 일수는 25일을 한도로 한다’고 했으니 25일이에요. 마지막 문장을 놓치면 ③, 첫 1년까지 세면 ④, 가산휴가를 빼먹으면 ①을 고르게 돼요.',
  '정답 ④ · 제3항은 피해자가 처벌을 원하지 않는다는 뜻을 분명히 밝히면 재판에 넘길 수 없다는 뜻이에요. ‘비방’은 남을 헐뜯어 깎아내리는 것이고, 제1항은 거짓이 아닌 사실을 드러내도 처벌하며, ‘자격정지’는 운전면허가 아니라 공무원이 될 자격 같은 공법상 자격을 일정 기간 멈추게 하는 형벌이에요.',
];
const MAX_ELAPSED_SECONDS = 3600;
const TOP_RANK_LIMIT = 20;
const BANNED_WORDS = ['시발', '씨발', '병신', '개새', '좆'];

// createStorage는 JSON으로 저장할 수 있는 타입만 받아서 interface 대신 type으로 선언한다.
type MockAttempt = {
  attemptCode: string;
  visitorId: string;
  ranked: boolean;
  startedAt: number;
  submittedAt: number | null;
  correctCount: number | null;
  elapsedSeconds: number | null;
  nickname: string | null;
  corrects?: boolean[];
};

// 로컬 데모용 기존 참가자. 'DEMO2026'은 도전장 링크(/literacy/c/DEMO2026) 확인용이다.
const SEED_RECORDS: Array<[string, string, number, number]> = [
  ['SEED0001', '출근길독서왕', 5, 172],
  ['SEED0002', '약관정독러', 5, 211],
  ['SEED0003', '행간마스터', 5, 248],
  ['SEED0004', '각주까지읽음', 5, 296],
  ['SEED0005', '문장수집가', 4, 166],
  ['SEED0006', '새벽세시독자', 4, 203],
  ['DEMO2026', '민지', 4, 231],
  ['SEED0008', '뉴스레터덕후', 4, 239],
  ['SEED0009', '오타사냥꾼', 4, 287],
  ['SEED0010', '점심시간독서', 4, 298],
  ['SEED0011', '글자탐험가', 3, 190],
  ['SEED0012', '오늘도한통', 3, 214],
  ['SEED0013', '주말토리애독자', 3, 260],
  ['SEED0014', '밑줄긋는사람', 3, 305],
  ['SEED0015', '천천히읽기', 3, 342],
  ['SEED0016', '책읽는고양이', 2, 155],
  ['SEED0017', '퇴근길독서러', 2, 188],
  ['SEED0018', '헤드라인헌터', 2, 240],
  ['SEED0019', '문해력새싹', 2, 276],
  ['SEED0020', '한줄요약러', 1, 98],
  ['SEED0021', '김봄봄', 1, 121],
  ['SEED0022', '새내기리더', 2, 301],
  ['SEED0023', '뉴스한입', 2, 333],
  ['SEED0024', '오늘의한줄', 1, 140],
  ['SEED0025', '느긋한독자', 1, 320],
  ['SEED0026', '활자중독예비', 0, 95],
];

const SEED_ATTEMPTS: MockAttempt[] = SEED_RECORDS.map(
  ([attemptCode, nickname, correctCount, elapsedSeconds], index) => ({
    attemptCode,
    visitorId: `seed-${index}`,
    ranked: true,
    startedAt: index,
    submittedAt: index,
    correctCount,
    elapsedSeconds,
    nickname,
  }),
);

const attemptStorage = createStorage<MockAttempt[]>(
  'msw-literacy-attempts',
  [],
);

const getAllAttempts = () => [...SEED_ATTEMPTS, ...attemptStorage.get()];

const findAttempt = (attemptCode: string) =>
  getAllAttempts().find((attempt) => attempt.attemptCode === attemptCode);

const saveAttempt = (updated: MockAttempt) => {
  const stored = attemptStorage.get();
  const index = stored.findIndex(
    (attempt) => attempt.attemptCode === updated.attemptCode,
  );
  if (index === -1) stored.push(updated);
  else stored[index] = updated;
  attemptStorage.set(stored);
};

const createAttemptCode = () =>
  Array.from(
    { length: 8 },
    () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)],
  ).join('');

const isSubmittedRanked = (attempt: MockAttempt) =>
  attempt.ranked && attempt.submittedAt !== null;

const compareRecord = (a: MockAttempt, b: MockAttempt) =>
  (b.correctCount ?? 0) - (a.correctCount ?? 0) ||
  (a.elapsedSeconds ?? 0) - (b.elapsedSeconds ?? 0) ||
  (a.submittedAt ?? 0) - (b.submittedAt ?? 0);

// 닉네임 등록한 ranked 제출끼리 순위를 매긴다. me가 미등록이면 '등록하면 몇 위'로 끼워 넣는다.
const getRankedList = (me?: MockAttempt) => {
  const registered = getAllAttempts().filter(
    (attempt) =>
      isSubmittedRanked(attempt) &&
      attempt.nickname !== null &&
      attempt.attemptCode !== me?.attemptCode,
  );
  return (me ? [...registered, me] : registered).sort(compareRecord);
};

const toEntry = (attempt: MockAttempt, rank: number, meCode?: string) => ({
  rank,
  nickname: attempt.nickname,
  correctCount: attempt.correctCount ?? 0,
  elapsedSeconds: attempt.elapsedSeconds ?? 0,
  me: attempt.attemptCode === meCode,
});

const getParticipantCount = () =>
  getAllAttempts().filter(isSubmittedRanked).length;

const getExpectedRank = (attempt: MockAttempt) =>
  getRankedList(attempt).findIndex(
    (item) => item.attemptCode === attempt.attemptCode,
  ) + 1;

const isSameAnswer = (picked: number[], key: number[]) =>
  picked.length === key.length &&
  [...picked].sort().every((value, index) => value === key[index]);

const isValidAnswers = (answers: unknown): answers is number[][] =>
  Array.isArray(answers) &&
  answers.length === ANSWER_KEYS.length &&
  answers.every(
    (picked, index) =>
      Array.isArray(picked) &&
      new Set(picked).size === picked.length &&
      picked.every(
        (choice) =>
          Number.isInteger(choice) &&
          choice >= 1 &&
          choice <= (CHOICE_COUNTS[index] ?? 0),
      ),
  );

const getNicknameError = (nickname: unknown) => {
  if (typeof nickname !== 'string' || !nickname.trim()) {
    return '닉네임을 입력해 주세요';
  }
  const trimmed = nickname.trim();
  if (trimmed.length < 2 || trimmed.length > 10) {
    return '닉네임은 2~10자로 써 주세요';
  }
  const lower = trimmed.toLowerCase();
  if (lower.includes('http') || lower.includes('www.')) {
    return '닉네임에 주소는 쓸 수 없어요';
  }
  if (BANNED_WORDS.some((word) => lower.includes(word))) {
    return '쓸 수 없는 단어가 들어 있어요';
  }
  return null;
};

const createSubmissionResponse = (attempt: MockAttempt) => {
  const corrects = attempt.corrects ?? [];
  return {
    correctCount: attempt.correctCount,
    elapsedSeconds: attempt.elapsedSeconds,
    ranked: attempt.ranked,
    expectedRank: attempt.ranked ? getExpectedRank(attempt) : null,
    participantCount: getParticipantCount(),
    questions: corrects.map((correct, index) => ({
      number: index + 1,
      correct,
      answer: ANSWER_KEYS[index],
      explanation: EXPLANATIONS[index],
    })),
  };
};

export const literacyQuizHandlers = [
  http.get(`${baseURL}/summary`, () => {
    const [topRanker] = getRankedList();
    return HttpResponse.json({
      participantCount: getParticipantCount(),
      topRanker: topRanker
        ? {
            nickname: topRanker.nickname,
            correctCount: topRanker.correctCount,
            elapsedSeconds: topRanker.elapsedSeconds,
          }
        : null,
    });
  }),

  // claim은 /attempts/:attemptCode 계열보다 먼저 둔다.
  http.post(`${baseURL}/attempts/claim`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${baseURL}/attempts`, async ({ request }) => {
    const body = (await request.json()) as { visitorId?: string };
    if (!body.visitorId) {
      return HttpResponse.json(
        { message: 'visitorId가 필요합니다.' },
        { status: 400 },
      );
    }

    const hasTriedBefore = attemptStorage
      .get()
      .some((attempt) => attempt.visitorId === body.visitorId);
    const attempt: MockAttempt = {
      attemptCode: createAttemptCode(),
      visitorId: body.visitorId,
      ranked: !hasTriedBefore,
      startedAt: Date.now(),
      submittedAt: null,
      correctCount: null,
      elapsedSeconds: null,
      nickname: null,
    };
    saveAttempt(attempt);

    return HttpResponse.json(
      {
        attemptCode: attempt.attemptCode,
        startedAt: new Date(attempt.startedAt).toISOString().slice(0, 19),
        ranked: attempt.ranked,
      },
      { status: 201 },
    );
  }),

  http.post(
    `${baseURL}/attempts/:attemptCode/submission`,
    async ({ request, params }) => {
      const { visitorId, answers } = (await request.json()) as {
        visitorId?: string;
        answers?: unknown;
      };
      const attempt = findAttempt(String(params.attemptCode));
      // 실제 서버처럼 시작할 때의 visitorId와 다르면 없는 시도로 본다.
      if (!attempt || attempt.visitorId !== visitorId) {
        return HttpResponse.json(
          { message: '없는 시도입니다.' },
          { status: 404 },
        );
      }
      // 응답을 못 받은 같은 방문자가 다시 제출하면 처음 저장한 결과를 그대로 돌려준다(실제 서버와 같은 규칙).
      if (attempt.submittedAt !== null) {
        return HttpResponse.json(createSubmissionResponse(attempt));
      }

      if (!isValidAnswers(answers)) {
        return HttpResponse.json(
          { message: '답안 형식이 올바르지 않습니다.' },
          { status: 400 },
        );
      }

      const corrects = answers.map((picked, index) =>
        isSameAnswer(picked, ANSWER_KEYS[index] ?? []),
      );
      const submittedAt = Date.now();
      const submitted: MockAttempt = {
        ...attempt,
        corrects,
        submittedAt,
        correctCount: corrects.filter(Boolean).length,
        elapsedSeconds: Math.min(
          MAX_ELAPSED_SECONDS,
          Math.floor((submittedAt - attempt.startedAt) / 1000),
        ),
      };
      // 실제 서버는 걸린 시간이 30초 미만이면 ranked=false·expectedRank=null로 응답한다.
      // 로컬 데모는 바로 제출해 보는 경우가 많아서 목에서는 이 규칙을 적용하지 않는다.
      saveAttempt(submitted);

      return HttpResponse.json(createSubmissionResponse(submitted));
    },
  ),

  http.put(
    `${baseURL}/attempts/:attemptCode/nickname`,
    async ({ request, params }) => {
      const { visitorId, nickname } = (await request.json()) as {
        visitorId?: string;
        nickname?: unknown;
      };
      const attempt = findAttempt(String(params.attemptCode));
      if (!attempt || attempt.visitorId !== visitorId) {
        return HttpResponse.json(
          { message: '없는 시도입니다.' },
          { status: 404 },
        );
      }
      if (!isSubmittedRanked(attempt)) {
        return HttpResponse.json(
          { message: '랭킹에 등록할 수 없는 기록이에요.' },
          { status: 409 },
        );
      }

      const errorMessage = getNicknameError(nickname);
      if (errorMessage) {
        return HttpResponse.json({ message: errorMessage }, { status: 400 });
      }

      const registered = { ...attempt, nickname: String(nickname).trim() };
      saveAttempt(registered);
      return HttpResponse.json({ rank: getExpectedRank(registered) });
    },
  ),

  http.get(`${baseURL}/ranking`, ({ request }) => {
    const attemptCode =
      new URL(request.url).searchParams.get('attemptCode') ?? undefined;
    const attempt = attemptCode ? findAttempt(attemptCode) : undefined;
    const me = attempt && isSubmittedRanked(attempt) ? attempt : undefined;
    const list = getRankedList(me);
    const myRank = me
      ? list.findIndex((item) => item.attemptCode === me.attemptCode) + 1
      : 0;

    return HttpResponse.json({
      participantCount: getParticipantCount(),
      top: list
        .slice(0, TOP_RANK_LIMIT)
        .map((item, index) => toEntry(item, index + 1, me?.attemptCode)),
      me: me
        ? {
            rank: myRank,
            nickname: me.nickname,
            correctCount: me.correctCount,
            elapsedSeconds: me.elapsedSeconds,
          }
        : null,
      around:
        me && myRank > TOP_RANK_LIMIT
          ? list
              .slice(Math.max(0, myRank - 3), myRank + 2)
              .map((item) =>
                toEntry(item, list.indexOf(item) + 1, me.attemptCode),
              )
          : [],
    });
  }),

  http.get(`${baseURL}/challenges/:attemptCode`, ({ params }) => {
    const attempt = findAttempt(String(params.attemptCode));
    if (!attempt || attempt.submittedAt === null) {
      return HttpResponse.json(
        { message: '없는 도전장입니다.' },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      nickname: attempt.nickname,
      correctCount: attempt.correctCount,
      elapsedSeconds: attempt.elapsedSeconds,
    });
  }),
];
