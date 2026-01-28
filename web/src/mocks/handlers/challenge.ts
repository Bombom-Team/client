import { http, HttpResponse } from 'msw';
import { CHALLENGES } from '../datas/challenge';
import { CHALLENGE_COMMENTS } from '../datas/challengeComments';
import { DAILY_GUIDE_COMMENTS } from '../datas/dailyGuideComments';
import { ENV } from '@/apis/env';
import type {
  GetChallengeCommentsResponse,
  GetChallengeEligibilityResponse,
  GetDailyGuideCommentsResponse,
  GetTodayDailyGuideResponse,
  GetChallengeTeamsResponse,
  GetChallengesTeamsProgressResponse,
} from '@/apis/challenge/challenge.api';

const baseURL = ENV.baseUrl;

const CHALLENGE_TEAMS_RESPONSE: GetChallengeTeamsResponse = {
  totalTeamCount: 3,
  myTeamId: 10,
  teams: [
    {
      teamId: 1,
      teamNumber: 1,
      isMyTeam: false,
    },
    {
      teamId: 10,
      teamNumber: 2,
      isMyTeam: true,
    },
    {
      teamId: 12,
      teamNumber: 3,
      isMyTeam: false,
    },
  ],
};

const buildWeekdayDates = (startDate: string, endDate: string) => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let current = new Date(start); current <= end; ) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      const dateString = current.toISOString().split('T')[0];
      if (dateString) {
        dates.push(dateString);
      }
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

const buildTeamProgressResponse = (
  challengeId: number,
  teamId: number,
): GetChallengesTeamsProgressResponse => {
  const challenge = CHALLENGES.find((item) => item.id === challengeId);
  const startDate = challenge?.startDate ?? '2026-01-05';
  const endDate = challenge?.endDate ?? '2026-01-16';
  const weekdayDates = buildWeekdayDates(startDate, endDate);
  const totalDays = weekdayDates.length;

  const buildProgresses = (
    seed: number,
  ): GetChallengesTeamsProgressResponse['members'][number]['dailyProgresses'] =>
    weekdayDates.flatMap<
      GetChallengesTeamsProgressResponse['members'][number]['dailyProgresses'][number]
    >((date, index) => {
      const value = (index + seed + teamId) % 5;
      if (value === 0) {
        return [{ date, status: 'SHIELD' }];
      }
      if (value <= 2) {
        return [{ date, status: 'COMPLETE' }];
      }
      return [];
    });

  return {
    challenge: {
      startDate,
      endDate,
      totalDays,
    },
    teamSummary: {
      achievementAverage: Math.min(100, 70 + (teamId % 3) * 10),
    },
    members: [
      {
        memberId: teamId * 100 + 1,
        nickname: `멤버1`,
        isSurvived: true,
        dailyProgresses: buildProgresses(1),
      },
      {
        memberId: teamId * 100 + 2,
        nickname: `멤버2`,
        isSurvived: teamId % 2 === 0,
        dailyProgresses: buildProgresses(2),
      },
      {
        memberId: teamId * 100 + 3,
        nickname: `멤버3`,
        isSurvived: true,
        dailyProgresses: buildProgresses(3),
      },
    ],
  };
};

export const challengeHandlers = [
  http.get(`${baseURL}/challenges`, () => {
    return HttpResponse.json(CHALLENGES);
  }),

  http.get(`${baseURL}/challenges/:challengeId/eligibility`, ({ params }) => {
    const { challengeId } = params;

    // 테스트를 위한 다양한 케이스
    // challengeId가 1이면 신청 가능
    // challengeId가 2이면 로그인 필요
    // challengeId가 3이면 구독 필요
    // challengeId가 4이면 이미 시작됨
    // challengeId가 5이면 이미 신청함
    // 그 외에는 로그인과 구독 모두 필요

    let response: GetChallengeEligibilityResponse;

    if (challengeId === '1') {
      response = {
        canApply: true,
        reason: 'ELIGIBLE',
      };
    } else if (challengeId === '2') {
      response = {
        canApply: false,
        reason: 'NOT_LOGGED_IN',
      };
    } else if (challengeId === '3') {
      response = {
        canApply: false,
        reason: 'NOT_SUBSCRIBED',
      };
    } else if (challengeId === '4') {
      response = {
        canApply: false,
        reason: 'ALREADY_STARTED',
      };
    } else if (challengeId === '5') {
      response = {
        canApply: false,
        reason: 'ALREADY_APPLIED',
      };
    } else {
      response = {
        canApply: true,
        reason: 'ELIGIBLE',
      };
    }

    return HttpResponse.json(response);
  }),

  http.post(`${baseURL}/challenges/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete(`${baseURL}/challenges/:challengeId/application`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${baseURL}/challenges/:challengeId/comments`, ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('start') || '';
    const end = url.searchParams.get('end') || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '20', 10);

    const filteredComments = CHALLENGE_COMMENTS.filter((comment) => {
      const commentDate = comment.createdAt?.split('T')[0];
      return commentDate && commentDate >= start && commentDate <= end;
    });

    const totalElements = filteredComments.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIdx = page * size;
    const endIdx = startIdx + size;
    const content = filteredComments.slice(startIdx, endIdx);

    const response: GetChallengeCommentsResponse = {
      content,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        offset: startIdx,
        paged: true,
        unpaged: false,
      },
      totalElements,
      totalPages,
      last: page >= totalPages - 1,
      size,
      number: page,
      sort: {
        empty: true,
        sorted: false,
        unsorted: true,
      },
      numberOfElements: content.length,
      first: page === 0,
      empty: content.length === 0,
    };

    return HttpResponse.json(response);
  }),

  http.get(`${baseURL}/challenges/:challengeId/teams`, () => {
    return HttpResponse.json(CHALLENGE_TEAMS_RESPONSE);
  }),

  http.get(
    `${baseURL}/challenges/:challengeId/progress/teams/:teamId`,
    ({ params }) => {
      const challengeId = Number(params.challengeId);
      const teamId = Number(params.teamId);

      return HttpResponse.json(buildTeamProgressResponse(challengeId, teamId));
    },
  ),

  http.get(`${baseURL}/challenges/:challengeId/teams/:teamId`, ({ params }) => {
    const challengeId = Number(params.challengeId);
    const teamId = Number(params.teamId);

    return HttpResponse.json(buildTeamProgressResponse(challengeId, teamId));
  }),

  http.get(
    `${baseURL}/challenges/:challengeId/daily-guides/today`,
    ({ params }) => {
      const { challengeId } = params;

      // challengeId에 따라 다른 타입의 데일리 가이드 반환
      const dailyGuides: Record<string, GetTodayDailyGuideResponse> = {
        '1': {
          dayIndex: 1,
          type: 'READ',
          imageUrl: '/assets/png/daily-guide-mock-image.png',
          notice: '첫 날입니다! 가볍게 시작해볼까요?',
          commentEnabled: false,
          myComment: {
            exists: false,
          },
        },
        '2': {
          dayIndex: 2,
          type: 'COMMENT',
          imageUrl: '/assets/png/daily-guide-mock-image.png',
          notice: '데일리 가이드에 따라 답변을 작성해주세요.',
          commentEnabled: true,
          myComment: {
            exists: false,
          },
        },
        '3': {
          dayIndex: 3,
          type: 'COMMENT',
          imageUrl: '/assets/png/daily-guide-mock-image.png',
          notice: '데일리 가이드에 따라 답변을 작성해주세요.',
          commentEnabled: true,
          myComment: {
            exists: true,
            content:
              '오늘 읽은 내용이 정말 유익했습니다. 특히 새로운 관점을 얻을 수 있어서 좋았어요!',
            createdAt: '2026-01-04T10:30:00Z',
          },
        },
        '4': {
          dayIndex: 4,
          type: 'SHARING',
          imageUrl: '/assets/png/daily-guide-mock-image.png',
          notice: '데일리 가이드에 따라 답변을 작성해주세요.',
          commentEnabled: true,
          myComment: {
            exists: false,
          },
        },
        '5': {
          dayIndex: 5,
          type: 'SHARING',
          imageUrl: '/assets/png/daily-guide-mock-image.png',
          notice: '데일리 가이드에 따라 답변을 작성해주세요.',
          commentEnabled: true,
          myComment: {
            exists: true,
            content:
              '오늘 읽은 내용이 정말 유익했습니다. 특히 새로운 관점을 얻을 수 있어서 좋았어요!',
            createdAt: '2026-01-04T10:30:00Z',
          },
        },
      };

      const dailyGuide = dailyGuides[challengeId as string] || dailyGuides['3'];

      return HttpResponse.json(dailyGuide);
    },
  ),

  http.post(
    `${baseURL}/challenges/:challengeId/daily-guides/:dayIndex/my-comment`,
    async () => {
      return HttpResponse.json({ success: true });
    },
  ),

  http.get(
    `${baseURL}/challenges/:challengeId/daily-guides/:dayIndex/comments`,
    ({ request }) => {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0', 10);
      const size = parseInt(url.searchParams.get('size') || '20', 10);

      const totalElements = DAILY_GUIDE_COMMENTS.length;
      const totalPages = Math.ceil(totalElements / size);
      const startIdx = page * size;
      const endIdx = startIdx + size;
      const content = DAILY_GUIDE_COMMENTS.slice(startIdx, endIdx);

      const response: GetDailyGuideCommentsResponse = {
        content,
        pageable: {
          pageNumber: page,
          pageSize: size,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false,
          },
          offset: startIdx,
          paged: true,
          unpaged: false,
        },
        totalElements,
        totalPages,
        last: page >= totalPages - 1,
        size,
        number: page,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        numberOfElements: content.length,
        first: page === 0,
        empty: content.length === 0,
      };

      return HttpResponse.json(response);
    },
  ),
];
