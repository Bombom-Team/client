import { http, HttpResponse } from 'msw';
import { CHALLENGES } from '../datas/challenge';
import { CHALLENGE_COMMENTS } from '../datas/challengeComments';
import { ENV } from '@/apis/env';
import type {
  GetChallengesEligibilityResponse,
  GetChallengeCommentsResponse,
} from '@/apis/challenge/challenge.api';

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
    // challengeId가 4이면 이미 시작됨
    // challengeId가 5이면 이미 신청함
    // 그 외에는 로그인과 구독 모두 필요

    let response: GetChallengesEligibilityResponse;

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

  http.post(`${baseURL}/challenge/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete(`${baseURL}/challenge/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${baseURL}/challenges/:challengeId/comments`, ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '20', 10);

    const filteredComments = CHALLENGE_COMMENTS.filter((comment) => {
      const commentDate = comment.createdAt?.split('T')[0];
      return commentDate && commentDate >= start && commentDate <= end;
    });

    const totalElements = filteredComments.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIdx = page * size;
    const endIdx = startIdx + size;
    const content = filteredComments.slice(startIdx, endIdx);

    const response: GetChallengeCommentsResponse = {
      content,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        offset: startIdx,
        paged: true,
        unpaged: false,
      },
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
      size,
      number: page,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      numberOfElements: content.length,
      first: page === 0,
      empty: content.length === 0,
    };

    return HttpResponse.json(response);
  }),
];
