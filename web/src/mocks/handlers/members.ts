import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
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
      }),
    );

    return HttpResponse.json(subscribedNewsletters);
  }),

  http.post(
    `${baseURL}/members/me/subscriptions/:subscriptionId/unsubscribe`,
    ({ params }) => {
      const { subscriptionId } = params;

      return HttpResponse.json({
        hasUnsubscribeUrl: true,
        unsubscribeUrl: `https://example.com/newsletters/${subscriptionId}/unsubscribe`,
      });
    },
  ),
];
