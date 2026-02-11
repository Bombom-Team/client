import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import {
  queueStore,
  createMockQueueEntry,
  QUEUE_SCENARIOS,
} from '../datas/queueEntry';
import type { QueueEntry } from '@/apis/event/event.api';

const baseURL = ENV.baseUrl;

// MSW 테스트용 시나리오 선택 (개발 시 변경하여 테스트)
// 'WAITING_HIGH' | 'WAITING_LOW' | 'ACTIVE_LONG' | 'ACTIVE_SHORT' | 'ISSUED' | 'NOT_IN_QUEUE' | 'DYNAMIC'
const MOCK_SCENARIO = 'DYNAMIC';

// 동적 시나리오: 등록 -> 대기 -> 입장 -> 발급 시뮬레이션
let registrationTime: number | null = null;
let currentStatus: QueueEntry['status'] = 'NOT_IN_QUEUE';

const getDynamicQueueEntry = (couponName: string): QueueEntry => {
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
    const { couponName } = params as { couponName: string };

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
    const { couponName } = params as { couponName: string };

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
];
