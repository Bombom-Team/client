import { http, HttpResponse } from 'msw';
import { ENV } from '@/env';

const baseURL = ENV.baseUrl;

export const membersHandlers = [
  http.get(`${baseURL}/members/me/profile`, () => {
    return HttpResponse.json({
      id: 1,
      email: 'maeilmailer@bombom.news',
      nickname: '매일메일러',
      profileImageUrl: 'https://avatar.iran.liara.run/public/42',
    });
  }),
];
