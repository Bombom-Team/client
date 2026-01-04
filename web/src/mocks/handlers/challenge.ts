import { http, HttpResponse } from 'msw';
import { CHALLENGES } from '../datas/challenge';
import { ENV } from '@/apis/env';
import type {
  GetChallengeEligibilityResponse,
  DailyGuide,
} from '@/apis/challenge/challenge.api';

const baseURL = ENV.baseUrl;

export const challengeHandlers = [
  http.get(`${baseURL}/challenges`, () => {
    return HttpResponse.json(CHALLENGES);
  }),

  http.get(`${baseURL}/challenges/:challengeId/eligibility`, ({ params }) => {
    const { challengeId } = params;

    // 테스트를 위한 다양한 케이스
    // challengeId가 1이면 신청 가능
    // challengeId가 2이면 로그인 필요
    // challengeId가 3이면 구독 필요
    // challengeId가 4이면 이미 시작됨
    // challengeId가 5이면 이미 신청함
    // 그 외에는 로그인과 구독 모두 필요

    let response: GetChallengeEligibilityResponse;

    if (challengeId === '1') {
      response = {
        canApply: true,
        reason: 'ELIGIBLE',
      };
    } else if (challengeId === '2') {
      response = {
        canApply: false,
        reason: 'NOT_LOGGED_IN',
      };
    } else if (challengeId === '3') {
      response = {
        canApply: false,
        reason: 'NOT_SUBSCRIBED',
      };
    } else if (challengeId === '4') {
      response = {
        canApply: false,
        reason: 'ALREADY_STARTED',
      };
    } else if (challengeId === '5') {
      response = {
        canApply: false,
        reason: 'ALREADY_APPLIED',
      };
    } else {
      response = {
        canApply: true,
        reason: 'ELIGIBLE',
      };
    }

    return HttpResponse.json(response);
  }),

  http.post(`${baseURL}/challenges/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete(`${baseURL}/challenges/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(
    `${baseURL}/challenges/:challengeId/daily-guide/today`,
    ({ params }) => {
      const { challengeId } = params;

      // challengeId에 따라 다른 타입의 데일리 가이드 반환
      const dailyGuides: Record<string, DailyGuide> = {
        '1': {
          dayIndex: 1,
          type: 'READ',
          imageUrl: 'https://picsum.photos/800/400?random=1',
          notice: '첫 날입니다! 가볍게 시작해볼까요?',
        },
        '2': {
          dayIndex: 2,
          type: 'COMMENT',
          imageUrl: '/assets/png/daily-guide-mock-image.jpeg',
          notice: '데일리 가이드에 따라 답변을 작성해주세요.',
        },
      };

      const dailyGuide =
        dailyGuides[challengeId as string] || dailyGuides['2'];

      return HttpResponse.json(dailyGuide);
    },
  ),
];
