import type {
  GrowthImageKey,
  GrowthLayer,
  GrowthStage,
  RecommendedNewsletter,
} from '../types/literacyQuiz';

export const DRUM_SLIDE_DURATION_MS = 3200;

export const SLIDE_DURATION_MS = 2800;

export const STORY_SLIDE_COUNT = 4;

export const RANKING_PAGE_SIZE = 5;

export const RANKING_MAX_RANK = 20;

export const RANKING_PAGE_COUNT = RANKING_MAX_RANK / RANKING_PAGE_SIZE;

const FLUENT_PATH = '/assets/png/literacy/fluent';

export const GROWTH_IMAGES: Record<GrowthImageKey, string> = {
  egg: `${FLUENT_PATH}/egg.png`,
  hatch: `${FLUENT_PATH}/hatching-chick.png`,
  chick: `${FLUENT_PATH}/baby-chick.png`,
  front: `${FLUENT_PATH}/front-facing-baby-chick.png`,
  owl: `${FLUENT_PATH}/owl.png`,
  book: `${FLUENT_PATH}/open-book.png`,
  mag: `${FLUENT_PATH}/magnifying-glass.png`,
  cap: `${FLUENT_PATH}/graduation-cap.png`,
  spark: `${FLUENT_PATH}/sparkles.png`,
};

// 맞힌 개수(0~5)별 캐릭터 그림. left·top·width는 그림 상자 대비 %이다.
export const GROWTH_LAYERS: GrowthLayer[][] = [
  [
    { image: 'egg', left: 22, top: 14, width: 56 },
    { image: 'sleep', left: 74, top: 8 },
  ],
  [{ image: 'hatch', left: 12, top: 10, width: 76 }],
  [
    { image: 'chick', left: 8, top: 14, width: 66 },
    { image: 'book', left: 54, top: 54, width: 40 },
  ],
  [
    { image: 'front', left: 14, top: 4, width: 72 },
    { image: 'book', left: 26, top: 56, width: 48 },
  ],
  [
    { image: 'front', left: 6, top: 8, width: 68 },
    { image: 'mag', left: 50, top: 38, width: 48 },
  ],
  [
    { image: 'owl', left: 16, top: 22, width: 70 },
    { image: 'cap', left: 26, top: 0, width: 48 },
    { image: 'spark', left: 2, top: 34, width: 24 },
  ],
];

export const GROWTH_STAGES: GrowthStage[] = [
  {
    name: '알 속의 독자',
    description: '오늘은 아직 알 속이에요. 한 번 더 풀면 톡 깨고 나올 거예요.',
    skill: '다음 판 기대주',
  },
  {
    name: '제목 요약 장인',
    description: '핵심만 쏙 빼 읽는 스타일. 오늘은 본문이 조금 서운했대요.',
    skill: '세 줄 요약',
  },
  {
    name: '속독의 달인',
    description:
      '읽는 속도는 확실한 재능! 조금만 천천히 읽으면 점수가 따라와요.',
    skill: '빨리 읽기',
  },
  {
    name: '눈치 빠른 독자',
    description: '큰 그림은 잘 봐요. 괄호 속 한 줄만 챙기면 금방 올라가요.',
    skill: '분위기 파악',
  },
  {
    name: '행간 탐정',
    description: '함정을 거의 다 피해 갔어요. 딱 한 군데서 발을 헛디뎠을 뿐!',
    skill: '함정 감지',
  },
  {
    name: '문해력 만렙',
    description:
      '약관 맨 아래 작은 글씨까지 읽는 사람. 계약서는 이분께 맡기세요.',
    skill: '작은 글씨 해독',
  },
];

// 맞힌 개수별 하루 5분 문구. 4개는 두 줄로 나눈다.
export const NEWSLETTER_TITLES = [
  ['하루 5분, 문해력이 자라는 첫 한 통'],
  ['하루 5분, 본문까지 읽는 문해력을 키워봐요'],
  ['빨리 읽는 힘에 하루 5분, 꼼꼼한 문해력을 더해요'],
  ['하루 5분 읽기로 문해력 한 단계 더 키워요'],
  ['한 끗 차이 만렙!', '하루 5분으로 문해력을 채워요'],
  ['하루 5분 경제 뉴스로 만렙 문해력을 더 단단하게'],
];

// 구독자 수는 프로토타입 확정 당시 봄봄 실제 숫자다.
export const RECOMMENDED_NEWSLETTERS = {
  dig: {
    id: 31,
    name: '디그',
    description:
      '세상 돌아가는 경제 이야기를 하루 5분 분량으로 쉽게 풀어줘요. 숫자와 조건을 읽는 감각이 붙어요.',
    subscriberCount: 502,
  },
  dailyByte: {
    id: 47,
    name: 'Daily Byte',
    description:
      '하루 10분, 경제를 가장 쉽게 읽는 방법을 내건 뉴스레터예요. 짧은 글로 매일 읽는 습관을 들이기 좋아요.',
    subscriberCount: 809,
  },
  catalog: {
    id: 48,
    name: '까탈로그',
    description:
      '에디터들이 까탈스럽게 고른 신제품과 사면 행복해지는 물건 이야기를 보내줘요.',
    subscriberCount: 376,
  },
  careet: {
    id: 2,
    name: '캐릿',
    description:
      '요즘 Z세대가 빠져 있는 트렌드와 콘텐츠를 짧게 브리핑해줘요. 가볍게 넘겨 보기 좋아요.',
    subscriberCount: 476,
  },
  weekend: {
    id: 53,
    name: '주말토리',
    description:
      '‘이번 주말에 뭐 하지?’ 고민을 덜어줘요. 금요일마다 즐거운 놀 거리를 보내줘요.',
    subscriberCount: 356,
  },
} satisfies Record<string, RecommendedNewsletter>;

// '뉴스레터 더 둘러보기' 카드에 겹쳐 보여 주는 로고(Daily Byte·캐릿·까탈로그)
export const BROWSE_NEWSLETTER_IDS = [
  RECOMMENDED_NEWSLETTERS.dailyByte.id,
  RECOMMENDED_NEWSLETTERS.careet.id,
  RECOMMENDED_NEWSLETTERS.catalog.id,
];

// 뉴스레터 목록을 못 받았을 때 보여 줄 개수(프로토타입 확정 당시 122개)
export const FALLBACK_NEWSLETTER_COUNT = 122;

export const FLUENT_ATTRIBUTION = 'Fluent Emoji © Microsoft, MIT License';
