import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import {
  queueStore,
  createMockQueueEntry,
  QUEUE_SCENARIOS,
  issuedCouponsStore,
  MOCK_COUPON_IMAGES,
  EVENT_TIME_SCENARIO,
  EVENT_START_TIME,
  EVENT_END_TIME,
} from '../datas/queueEntry';
import type { QueueEntry, CouponName } from '@/apis/event/event.api';
import type { EventErrorResponse } from '@/pages/event/types/event';

const baseURL = ENV.baseUrl;

// MSW 테스트용 시나리오 선택 (개발 시 변경하여 테스트)
// 'WAITING_HIGH' | 'WAITING_LOW' | 'ACTIVE_LONG' | 'ACTIVE_SHORT' | 'ISSUED' | 'NOT_IN_QUEUE' | 'DYNAMIC'
const MOCK_SCENARIO = 'DYNAMIC';

// 이벤트 시간 체크 함수
const checkEventTime = ():
  | { status: 'valid' }
  | { status: 'error'; response: EventErrorResponse; httpStatus: number } => {
  if (EVENT_TIME_SCENARIO === 'NOT_STARTED') {
    return {
      status: 'error',
      response: {
        status: 'BAD_REQUEST',
        code: 'C002',
        message: '이벤트가 아직 시작되지 않았습니다.',
        reason: 'EVENT_NOT_STARTED',
      },
      httpStatus: 400,
    };
  }

  if (EVENT_TIME_SCENARIO === 'ENDED') {
    return {
      status: 'error',
      response: {
        status: 'CONFLICT',
        code: 'C003',
        message: '이벤트가 종료되었습니다.',
        reason: 'EVENT_ENDED',
      },
      httpStatus: 409,
    };
  }

  // 실제 시간 기반 체크 (EVENT_TIME_SCENARIO가 'IN_PROGRESS'일 때도 동작)
  const now = new Date();
  if (now < EVENT_START_TIME) {
    return {
      status: 'error',
      response: {
        status: 'BAD_REQUEST',
        code: 'C002',
        message: '이벤트가 아직 시작되지 않았습니다.',
        reason: 'EVENT_NOT_STARTED',
      },
      httpStatus: 400,
    };
  }

  if (now > EVENT_END_TIME) {
    return {
      status: 'error',
      response: {
        status: 'CONFLICT',
        code: 'C003',
        message: '이벤트가 종료되었습니다.',
        reason: 'EVENT_ENDED',
      },
      httpStatus: 409,
    };
  }

  return { status: 'valid' };
};

// 동적 시나리오: 등록 -> 대기 -> 입장 -> 발급 시뮬레이션
let registrationTime: number | null = null;
let currentStatus: QueueEntry['status'] = 'NOT_IN_QUEUE';

const getDynamicQueueEntry = (couponName: CouponName): QueueEntry => {
  if (!registrationTime) {
    return createMockQueueEntry('NOT_IN_QUEUE', { couponName });
  }

  const elapsedSeconds = Math.floor((Date.now() - registrationTime) / 1000);

  // 시나리오: 등록 후 15초 대기 -> 30초 입장 허용 -> 발급 완료
  if (elapsedSeconds < 15) {
    // 대기 중 (순번이 점차 감소)
    const position = Math.max(1, 15 - elapsedSeconds);
    currentStatus = 'WAITING';
    return createMockQueueEntry('WAITING', {
      couponName,
      position,
      activeCount: 40 + elapsedSeconds,
      pollingTtlSeconds: 3,
    });
  } else if (elapsedSeconds < 45) {
    // 입장 허용 (30초 타이머)
    const remainingTime = 45 - elapsedSeconds;
    currentStatus = 'ACTIVE';
    return createMockQueueEntry('ACTIVE', {
      couponName,
      activeExpiresInSeconds: remainingTime,
      activeCount: 55,
    });
  } else {
    // 시간 초과 후 다시 대기열로 (실제로는 타임아웃 처리)
    // 테스트를 위해 WAITING으로 되돌림
    currentStatus = 'WAITING';
    return createMockQueueEntry('WAITING', {
      couponName,
      position: 5,
      activeCount: 60,
      pollingTtlSeconds: 3,
    });
  }
};

export const queueEntryHandlers = [
  // 대기열 등록
  http.post(`${baseURL}/coupons/:couponName/queue-entries`, ({ params }) => {
    const { couponName } = params as { couponName: CouponName };

    // 이벤트 시간 체크
    const timeCheck = checkEventTime();
    if (timeCheck.status === 'error') {
      return HttpResponse.json(timeCheck.response, {
        status: timeCheck.httpStatus,
      });
    }

    // 이미 등록된 경우 에러
    if (queueStore.has(couponName) && currentStatus !== 'NOT_IN_QUEUE') {
      return HttpResponse.json(
        {
          message: '이미 대기열에 등록되어 있습니다.',
        },
        { status: 400 },
      );
    }

    let queueEntry: QueueEntry;

    if (MOCK_SCENARIO === 'DYNAMIC') {
      // 동적 시나리오: 등록 시점 저장
      registrationTime = Date.now();
      queueEntry = getDynamicQueueEntry(couponName);
    } else {
      // 정적 시나리오
      queueEntry = QUEUE_SCENARIOS[MOCK_SCENARIO];
      currentStatus = queueEntry.status;
    }

    queueStore.set(couponName, queueEntry);

    return HttpResponse.json(queueEntry, { status: 201 });
  }),

  // 내 대기열 상태 조회
  http.get(`${baseURL}/coupons/:couponName/queue-entries/me`, ({ params }) => {
    const { couponName } = params as { couponName: CouponName };

    let queueEntry: QueueEntry;

    if (MOCK_SCENARIO === 'DYNAMIC') {
      queueEntry = getDynamicQueueEntry(couponName);
    } else {
      queueEntry = queueStore.get(couponName) || QUEUE_SCENARIOS[MOCK_SCENARIO];
    }

    // 대기열에 없는 경우
    if (!queueStore.has(couponName) && !registrationTime) {
      return HttpResponse.json(
        createMockQueueEntry('NOT_IN_QUEUE', { couponName }),
      );
    }

    return HttpResponse.json(queueEntry);
  }),

  // 쿠폰 발급
  http.post(`${baseURL}/coupons/:couponName/issues`, ({ params }) => {
    const { couponName } = params as { couponName: CouponName };

    // ACTIVE 상태가 아니면 발급 불가
    const queueEntry = queueStore.get(couponName);
    if (!queueEntry || queueEntry.status !== 'ACTIVE') {
      return HttpResponse.json(
        {
          message: '쿠폰 발급 가능한 상태가 아닙니다.',
        },
        { status: 400 },
      );
    }

    // 이미 발급된 쿠폰인지 확인
    const alreadyIssued = issuedCouponsStore.some(
      (coupon) => coupon.couponName === couponName,
    );
    if (alreadyIssued) {
      return HttpResponse.json(
        {
          message: '이미 발급된 쿠폰입니다.',
        },
        { status: 400 },
      );
    }

    // 쿠폰 발급
    const issuedAt = new Date().toISOString();
    const imageUrl = MOCK_COUPON_IMAGES[couponName];

    const issuedCoupon = {
      couponName,
      imageUrl,
      issuedAt,
    };

    issuedCouponsStore.push(issuedCoupon);

    // 대기열 상태를 ISSUED로 변경
    queueStore.set(couponName, {
      ...queueEntry,
      status: 'ISSUED',
    });

    return HttpResponse.json(
      {
        imageUrl,
        issuedAt,
      },
      { status: 201 },
    );
  }),

  // 대기열 취소
  http.delete(
    `${baseURL}/coupons/:couponName/queue-entries/me`,
    ({ params }) => {
      const { couponName } = params as { couponName: CouponName };

      // 대기열에 없는 경우
      if (!queueStore.has(couponName) && !registrationTime) {
        return HttpResponse.json(
          {
            message: '대기열에 등록되어 있지 않습니다.',
          },
          { status: 404 },
        );
      }

      // 대기열에서 제거
      queueStore.delete(couponName);

      // DYNAMIC 시나리오의 경우 등록 시간 초기화
      if (MOCK_SCENARIO === 'DYNAMIC') {
        registrationTime = null;
        currentStatus = 'NOT_IN_QUEUE';
      }

      return new HttpResponse(null, { status: 204 });
    },
  ),

  // 내가 발급받은 쿠폰 목록 조회
  http.get(`${baseURL}/coupons/issues/me`, () => {
    return HttpResponse.json(issuedCouponsStore);
  }),
];
