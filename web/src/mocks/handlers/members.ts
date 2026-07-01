import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import {
  CUMULATIVE_CATEGORY_STATS,
  MONTHLY_CATEGORY_STATS,
} from '../datas/categoryStats';
import {
  getRankingMetadata,
  getStreakRankingMetadata,
} from '../datas/monthlyReadingRank';
import { TRENDY_NEWSLETTERS } from '../datas/trendyNewsLetter';

const baseURL = ENV.baseUrl;

export const membersHandlers = [
  http.get(`${baseURL}/members/me/category-stats`, ({ request }) => {
    const url = new URL(request.url);
    const year = url.searchParams.get('year');
    const month = url.searchParams.get('month');

    return HttpResponse.json(
      year && month ? MONTHLY_CATEGORY_STATS : CUMULATIVE_CATEGORY_STATS,
    );
  }),

  http.get(`${baseURL}/members/me/rank`, () => {
    return HttpResponse.json({
      cards: [
        {
          type: 'streak',
          currentRank: 3,
          rankHistory: [
            { month: '2025-12', label: '25.12', rank: 20 },
            { month: '2026-01', label: '1월', rank: 14 },
            { month: '2026-02', label: '2월', rank: 20 },
            { month: '2026-03', label: '3월', rank: 12 },
            { month: '2026-04', label: '4월', rank: 9 },
            { month: '2026-05', label: '5월', rank: 3 },
          ],
          value: 52,
        },
        {
          type: 'reading',
          currentRank: 3,
          rankHistory: [
            { month: '2025-12', label: '25.12', rank: 20 },
            { month: '2026-01', label: '1월', rank: 15 },
            { month: '2026-02', label: '2월', rank: 19 },
            { month: '2026-03', label: '3월', rank: 10 },
            { month: '2026-04', label: '4월', rank: 8 },
            { month: '2026-05', label: '5월', rank: 3 },
          ],
          value: 248,
        },
      ],
    });
  }),

  http.get(`${baseURL}/members/me/subscriptions`, () => {
    const subscribedNewsletters = TRENDY_NEWSLETTERS.slice(0, 5).map(
      (newsletter, index) => {
        // 테스트를 위해 다양한 상태를 반환하도록 설정
        let status = 'SUBSCRIBED';
        if (index === 1) status = 'UNSUBSCRIBING';
        if (index === 2) status = 'UNSUBSCRIBE_FAILED';

        return {
          subscriptionId: index + 100, // 고유 ID 부여
          newsletterId: newsletter.newsletterId,
          name: newsletter.name,
          imageUrl: newsletter.imageUrl,
          description: newsletter.description,
          category: newsletter.category,
          // index 2번(실패 케이스)은 외부 링크 제공
          unsubscribeUrl:
            index === 2
              ? `https://example.com/unsubscribe/${newsletter.newsletterId}`
              : undefined,
          status,
        };
      },
    );

    return HttpResponse.json(subscribedNewsletters);
  }),

  http.post(
    `${baseURL}/members/me/subscriptions/:subscriptionId/unsubscribe`,
    () => {
      // 204 No Content 반환
      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.get(`${baseURL}/members/me/reading/month/rank`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const limitNumber = limit ? Number(limit) : 10;

    const { data, ...metaData } = getRankingMetadata();
    const rankingData = data.slice(0, limitNumber);

    return HttpResponse.json({
      ...metaData,
      data: rankingData,
    });
  }),

  http.get(`${baseURL}/members/me/reading/streak/rank`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');
    const limitNumber = limit ? Number(limit) : 10;

    const { data, ...metaData } = getStreakRankingMetadata();
    const rankingData = data.slice(0, limitNumber);

    return HttpResponse.json({
      ...metaData,
      data: rankingData,
    });
  }),

  http.get(`${baseURL}/members/me/reading/streak/rank/me`, () => {
    return HttpResponse.json({
      rank: 3,
      nickname: '나',
      dayCount: 52,
      badges: {
        challenge: {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'BRONZE',
        },
        monthlyRanking: {
          grade: 'GOLD',
          year: 2026,
          month: 6,
        },
        streak: {
          tier: 'THIRTY',
        },
      },
      streakShield: {
        status: 'AVAILABLE',
        remainingCount: 1,
        monthlyLimit: 1,
      },
    });
  }),

  http.get(`${baseURL}/members/me/reading/month/rank/me`, () => {
    return HttpResponse.json({
      rank: 3,
      nickname: '나',
      monthlyReadCount: 248,
      nextRankDifference: 12,
    });
  }),
];
