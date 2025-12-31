import { http, HttpResponse } from 'msw';
import { CHALLENGES } from '../datas/challenge';
import { ENV } from '@/apis/env';
import type { ChallengeEligibilityResponse } from '@/apis/challenge/challenge.api';

const baseURL = ENV.baseUrl;

export const challengeHandlers = [
  http.get(`${baseURL}/challenge`, () => {
    return HttpResponse.json(CHALLENGES);
  }),

  http.get(`${baseURL}/challenge/:challengeId/eligibility`, ({ params }) => {
    const { challengeId } = params;

    // 테스트를 위한 다양한 케이스
    // challengeId가 1이면 신청 가능
    // challengeId가 2이면 로그인 필요
    // challengeId가 3이면 구독 필요
    // 그 외에는 로그인과 구독 모두 필요

    let response: ChallengeEligibilityResponse;

    if (challengeId === '1') {
      response = {
        canApply: true,
        reasons: [],
      };
    } else if (challengeId === '2') {
      response = {
        canApply: false,
        reasons: ['NOT_LOGGED_IN'],
      };
    } else if (challengeId === '3') {
      response = {
        canApply: false,
        reasons: ['NOT_SUBSCRIBED'],
      };
    } else {
      response = {
        canApply: false,
        reasons: ['NOT_LOGGED_IN', 'NOT_SUBSCRIBED'],
      };
    }

    return HttpResponse.json(response);
  }),
];
