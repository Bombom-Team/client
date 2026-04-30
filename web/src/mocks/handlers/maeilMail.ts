import { http, HttpResponse } from 'msw';
import { MAEIL_MAIL_ARTICLE_ID } from '../datas/articleDetail';
import { ENV } from '@/apis/env';

const baseURL = ENV.baseUrl;

export const maeilMailHandlers = [
  http.get(`${baseURL}/maeil-mail/content`, ({ request }) => {
    const url = new URL(request.url);
    const articleId = Number(url.searchParams.get('articleId'));

    if (articleId !== MAEIL_MAIL_ARTICLE_ID) {
      return HttpResponse.json(
        { message: '매일메일 아티클이 아닙니다' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ contentId: 7 });
  }),

  http.post(
    `${baseURL}/maeil-mail/:contentId/answer/me`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        answer: string;
      };
      // eslint-disable-next-line no-console
      console.log('[mock] 매일메일 답변 제출', {
        contentIdInPath: Number(params.contentId),
        ...body,
      });

      return HttpResponse.json({}, { status: 200 });
    },
  ),
];
