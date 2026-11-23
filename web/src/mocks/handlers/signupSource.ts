import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import { SIGNUP_RECOMMENDATIONS } from '../datas/signupRecommendations';
import { createStorage } from '@/utils/localStorage';
import type { PostSignupSourceParams } from '@/apis/signupSource/signupSource.api';

const baseURL = ENV.baseUrl;

// 새로고침 뒤에도 "이미 답했는지"를 기억해서 다시 뜨는 조건을 확인할 수 있게 한다.
// 다시 처음 상태로 보려면 개발자 도구에서 이 key를 지운다.
const savedSignupSourceStorage = createStorage<string | null>(
  'msw-signup-source',
  null,
);

export const signupSourceHandlers = [
  http.get(`${baseURL}/members/me/signup-source`, () => {
    return HttpResponse.json({
      needsSignupSource: savedSignupSourceStorage.get() === null,
    });
  }),

  http.post(`${baseURL}/members/me/signup-source`, async ({ request }) => {
    const body = (await request.json()) as PostSignupSourceParams;
    savedSignupSourceStorage.set(body.source);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${baseURL}/newsletters/signup-recommendations`, () => {
    return HttpResponse.json(SIGNUP_RECOMMENDATIONS);
  }),
];
