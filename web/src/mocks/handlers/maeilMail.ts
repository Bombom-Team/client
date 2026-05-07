import { http, HttpResponse } from 'msw';
import { MAEIL_MAIL_ARTICLE_ID } from '../datas/articleDetail';
import { ENV } from '@/apis/env';

const baseURL = ENV.baseUrl;

const submittedAnswers = new Map<number, string>();

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

  http.get(
    `${baseURL}/maeil-mail/articles/:articleId/answers/me`,
    ({ params }) => {
      const articleId = Number(params.articleId);
      const answer = submittedAnswers.get(articleId);

      if (answer === undefined) {
        return HttpResponse.json(
          { message: '제출한 답변이 없습니다' },
          { status: 404 },
        );
      }

      return HttpResponse.json({ answer });
    },
  ),

  http.post(
    `${baseURL}/maeil-mail/articles/:articleId/answers/me`,
    async ({ request, params }) => {
      const body = (await request.json()) as {
        answer: string;
      };
      const articleId = Number(params.articleId);
      submittedAnswers.set(articleId, body.answer);
      // eslint-disable-next-line no-console
      console.log('[mock] 매일메일 답변 제출', {
        articleIdInPath: articleId,
        ...body,
      });

      return HttpResponse.json({}, { status: 200 });
    },
  ),
];
