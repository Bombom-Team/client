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
import type {
  GetMyChallengeSummaryResponse,
  GetMyOngoingChallengesResponse,
  GetMyCompletedChallengesResponse,
} from '@/apis/members/members.api';

const baseURL = ENV.baseUrl;

const MY_CHALLENGE_SUMMARY: GetMyChallengeSummaryResponse = {
  completedChallengeCount: 5,
  completionRank: {
    topPercent: 18,
    completionRate: 80,
  },
  attendanceRank: {
    topPercent: 7,
    averageAttendanceRate: 87,
  },
  medalRatio: {
    gold: 40,
    silver: 35,
    bronze: 25,
  },
};

const MY_ONGOING_CHALLENGES: GetMyOngoingChallengesResponse = {
  challenges: [
    {
      challengeId: 1,
      title: '뉴스레터 한달 읽기 챌린지',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      remainingDays: 13,
      progressRate: 57,
      myTeamRank: { rank: 2, totalMembers: 8 },
      teamRank: { rank: 5, totalTeams: 24 },
      myAttendanceComparison: { attendanceRate: 87, differencePoint: 12 },
      teamAttendanceComparison: {
        teamAttendanceRate: 74,
        differencePoint: -1,
      },
    },
  ],
};

const MY_COMPLETED_CHALLENGES_DATA: GetMyCompletedChallengesResponse['content'] =
  [
    {
      challengeId: 2,
      title: '봄봄 독서 챌린지 1기',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      attendanceRate: 93,
      grade: 'GOLD',
    },
    {
      challengeId: 3,
      title: '뉴스레터 완독 챌린지',
      startDate: '2026-04-01',
      endDate: '2026-04-30',
      attendanceRate: 76,
      grade: 'SILVER',
    },
    {
      challengeId: 4,
      title: '5월 습관 만들기 챌린지',
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      attendanceRate: 61,
      grade: 'BRONZE',
    },
    {
      challengeId: 5,
      title: '6월 집중 독서 챌린지',
      startDate: '2026-06-01',
      endDate: '2026-06-30',
      attendanceRate: 32,
      grade: 'FAIL',
    },
    {
      challengeId: 6,
      title: '7월 여름 독서 챌린지',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      attendanceRate: 88,
      grade: 'GOLD',
    },
    {
      challengeId: 7,
      title: '8월 완독 챌린지',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      attendanceRate: 72,
      grade: 'SILVER',
    },
    {
      challengeId: 8,
      title: '가을 뉴스레터 챌린지',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      attendanceRate: 65,
      grade: 'BRONZE',
    },
    {
      challengeId: 9,
      title: '10월 독서 습관 챌린지',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      attendanceRate: 90,
      grade: 'GOLD',
    },
    {
      challengeId: 10,
      title: '연말 마무리 챌린지',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      attendanceRate: 55,
      grade: 'BRONZE',
    },
  ];

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

  http.get(`${baseURL}/members/me/challenges/summary`, () => {
    return HttpResponse.json(MY_CHALLENGE_SUMMARY);
  }),

  http.get(`${baseURL}/members/me/challenges/ongoing`, () => {
    return HttpResponse.json(MY_ONGOING_CHALLENGES);
  }),

  http.get(`${baseURL}/members/me/challenges/completed`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '0', 10);
    const size = parseInt(url.searchParams.get('size') ?? '20', 10);

    const total = MY_COMPLETED_CHALLENGES_DATA.length;
    const totalPages = Math.ceil(total / size);
    const start = page * size;
    const content = MY_COMPLETED_CHALLENGES_DATA.slice(start, start + size);

    const response: GetMyCompletedChallengesResponse = {
      totalElements: total,
      totalPages,
      first: page === 0,
      last: page >= totalPages - 1,
      size,
      content,
    };

    return HttpResponse.json(response);
  }),
];
