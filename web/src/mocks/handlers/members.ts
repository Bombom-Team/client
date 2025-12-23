import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import { getRankingMetadata } from '../datas/monthlyReadingRank';
import { TRENDY_NEWSLETTERS } from '../datas/trendyNewsLetter';

const baseURL = ENV.baseUrl;

export const membersHandlers = [
  http.get(`${baseURL}/members/me/subscriptions`, () => {
    const subscribedNewsletters = TRENDY_NEWSLETTERS.slice(0, 5).map(
      (newsletter) => ({
        newsletterId: newsletter.newsletterId,
        name: newsletter.name,
        imageUrl: newsletter.imageUrl,
        description: newsletter.description,
        category: newsletter.category,
        hasUnsubscribeUrl: true,
      }),
    );

    return HttpResponse.json(subscribedNewsletters);
  }),

  http.post(
    `${baseURL}/members/me/subscriptions/:subscriptionId/unsubscribe`,
    ({ params }) => {
      const { subscriptionId } = params;

      return HttpResponse.json({
        unsubscribeUrl: `https://example.com/newsletters/${subscriptionId}/unsubscribe`,
      });
    },
  ),

  http.get(`${baseURL}/members/me/reading/month/rank`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const limitNumber = limit ? Number(limit) : 10;

    const { data, ...metadata } = getRankingMetadata();
    const rankingData = data.slice(0, limitNumber);

    return HttpResponse.json({
      ...metadata,
      data: rankingData,
    });
  }),
];
