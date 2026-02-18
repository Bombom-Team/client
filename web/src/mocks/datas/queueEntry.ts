import type {
  QueueEntry,
  QueueStatus,
  IssuedCoupon,
} from '@/apis/event/event.api';

// 대기열 상태를 관리하는 mock 저장소
export const queueStore = new Map<string, QueueEntry>();

// 발급된 쿠폰을 관리하는 mock 저장소
export const issuedCouponsStore: IssuedCoupon[] = [
  {
    couponName: 'day1-coupon',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop',
    issuedAt: new Date().toISOString(),
  },
  {
    couponName: 'day2-coupon',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop',
    issuedAt: new Date().toISOString(),
  },
];

// 초기 mock 데이터 생성 함수
export const createMockQueueEntry = (
  status: QueueStatus,
  options?: Partial<QueueEntry>,
): QueueEntry => {
  const baseEntry: QueueEntry = {
    couponName: 'day1-coupon',
    status,
    position: null,
    activeCount: 45,
    activeExpiresInSeconds: null,
    pollingTtlSeconds: null,
    reason: null,
  };

  // 상태별 기본값 설정
  switch (status) {
    case 'WAITING':
      return {
        ...baseEntry,
        position: 12,
        pollingTtlSeconds: 3,
        ...options,
      };
    case 'ACTIVE':
      return {
        ...baseEntry,
        activeExpiresInSeconds: 30,
        ...options,
      };
    case 'ISSUED':
      return {
        ...baseEntry,
        ...options,
      };
    case 'NOT_IN_QUEUE':
      return {
        ...baseEntry,
        activeCount: 0,
        ...options,
      };
    case 'SOLD_OUT':
      return {
        ...baseEntry,
        activeCount: 10,
        pollingTtlSeconds: 3,
        reason: 'SOLD_OUT',
        ...options,
      };
    default:
      return { ...baseEntry, ...options };
  }
};

// 시나리오별 mock 데이터
export const QUEUE_SCENARIOS = {
  // 대기 중 (순번이 높음)
  WAITING_HIGH: createMockQueueEntry('WAITING', {
    position: 50,
    activeCount: 30,
  }),

  // 대기 중 (순번이 낮음 - 곧 입장)
  WAITING_LOW: createMockQueueEntry('WAITING', {
    position: 3,
    activeCount: 48,
  }),

  // 입장 허용 (시간 많이 남음)
  ACTIVE_LONG: createMockQueueEntry('ACTIVE', {
    activeExpiresInSeconds: 60,
    activeCount: 50,
  }),

  // 입장 허용 (시간 얼마 안 남음)
  ACTIVE_SHORT: createMockQueueEntry('ACTIVE', {
    activeExpiresInSeconds: 10,
    activeCount: 55,
  }),

  // 발급 완료
  ISSUED: createMockQueueEntry('ISSUED'),

  // 대기열에 없음
  NOT_IN_QUEUE: createMockQueueEntry('NOT_IN_QUEUE'),

  // 쿠폰 소진
  SOLD_OUT: createMockQueueEntry('SOLD_OUT'),
};

// Mock 쿠폰 이미지 데이터
export const MOCK_COUPON_IMAGES = {
  'day1-coupon':
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop',
  'day2-coupon':
    'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=250&fit=crop',
  avengers:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop',
} as const;

// 이벤트 시간 설정 (테스트용)
// 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED'를 테스트하려면 아래 값을 변경
export const EVENT_TIME_SCENARIO: 'NOT_STARTED' | 'IN_PROGRESS' | 'ENDED' =
  'IN_PROGRESS';

// 이벤트 시작/종료 시간 (테스트용 - 현재 시간 기준)
export const EVENT_START_TIME = new Date(Date.now() - 1000 * 60 * 60); // 1시간 전 시작
export const EVENT_END_TIME = new Date(Date.now() + 1000 * 60 * 60); // 1시간 후 종료
