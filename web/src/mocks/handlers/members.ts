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
  http.get(`${baseURL}/mypage/category-stats`, ({ request }) => {
    const url = new URL(request.url);
    const yearMonth = url.searchParams.get('yearMonth');

    return HttpResponse.json(
      yearMonth ? MONTHLY_CATEGORY_STATS : CUMULATIVE_CATEGORY_STATS,
    );
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
          grade: 'bronze',
        },
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

  http.get(`${baseURL}/members/me/join-days`, () => {
    return HttpResponse.json({
      daysSinceJoined: 141,
      joinedAt: '2026-01-28',
    });
  }),

  http.get(`${baseURL}/members/me/reading/dashboard`, () => {
    return HttpResponse.json({
      readArticleCount: 248,
      readArticleChangeRate: 32,
      readArticleChangeDirection: 'UP',
      bookmarkCount: 132,
      frequentReadNewsletters: [
        { rank: 1, newsletterId: 1, name: '뉴닉', readCount: 12 },
        { rank: 2, newsletterId: 2, name: '데일리바이트', readCount: 5 },
        { rank: 3, newsletterId: 3, name: '부딩', readCount: 2 },
      ],
    });
  }),

  http.get(`${baseURL}/members/me/reading/calendar`, ({ request }) => {
    const url = new URL(request.url);
    const year = Number(url.searchParams.get('year'));
    const month = Number(url.searchParams.get('month'));
    const daysInMonth = new Date(year, month, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const readCount = (day * 7) % 9;

      return {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        read: readCount > 0,
        readCount,
      };
    });

    return HttpResponse.json(days);
  }),
];
