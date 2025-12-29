import { http, HttpResponse } from 'msw';
import { CHALLENGES } from '../datas/challenge';
import { ENV } from '@/apis/env';

const baseURL = ENV.baseUrl;

export const challengeHandlers = [
  http.get(`${baseURL}/challenge`, () => {
    return HttpResponse.json(CHALLENGES);
  }),
];
