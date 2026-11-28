import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import { SIGNUP_RECOMMENDATIONS } from '../datas/signupRecommendations';
import { createStorage } from '@/utils/localStorage';

const baseURL = ENV.baseUrl;

// MSW를 켤 때마다 가입 경로 모달이 뜨지 않도록 기본은 "이미 답한 회원"으로 둔다.
// 모달을 확인하려면 개발자 도구에서 localStorage의 이 key를 true로 바꾸고 새로고침한다.
// 모달에서 답하면 key가 지워져 다시 뜨지 않는다.
const showSignupSourceStorage = createStorage<boolean>(
  'msw-show-signup-source',
  false,
);

export const signupSourceHandlers = [
  http.get(`${baseURL}/members/me/signup-source`, () => {
    return HttpResponse.json({
      needsSignupSource: showSignupSourceStorage.get(),
    });
  }),

  http.post(`${baseURL}/members/me/signup-source`, () => {
    showSignupSourceStorage.remove();
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${baseURL}/newsletters/signup-recommendations`, () => {
    return HttpResponse.json(SIGNUP_RECOMMENDATIONS);
  }),
];
