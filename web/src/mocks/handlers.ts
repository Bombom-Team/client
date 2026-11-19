import { http, HttpResponse } from 'msw';
import { ENV } from '../apis/env';
import {
  NEWSLETTER_CATEGORIES,
  TRENDY_NEWSLETTERS,
} from './datas/trendyNewsLetter';
import { articleHandlers } from './handlers/articles';
import { blogHandlers } from './handlers/blog';
import { bookmarkHandlers } from './handlers/bookmark';
import { challengeHandlers } from './handlers/challenge';
import { inquiryHandlers } from './handlers/inquiry';
import { maeilMailHandlers } from './handlers/maeilMail';
import { membersHandlers } from './handlers/members';
import { newsletterDetailHandlers } from './handlers/newsletterDetail';
import { queueEntryHandlers } from './handlers/queueEntry';
import type { Highlight } from '@/pages/detail/types/highlight';

const baseURL = ENV.baseUrl;

const HIGHLIGHTS: Highlight[] = [];
let lastHighlightId = 0;

export const handlers = [
  // 뉴스레터 목록
  http.get(`${baseURL}/newsletters`, () => {
    return HttpResponse.json({
      categories: NEWSLETTER_CATEGORIES,
      newsletters: TRENDY_NEWSLETTERS,
    });
  }),

  // 멤버 읽기 상태
  http.get(`${baseURL}/members/me/reading`, () => {
    return HttpResponse.json({
      streakReadDay: 3,
      today: {
        readCount: 2,
        totalCount: 5,
      },
      weekly: {
        readCount: 7,
        goalCount: 10,
      },
    });
  }),

  // 펫 정보 조회
  http.get(`${baseURL}/members/me/pet`, () => {
    return HttpResponse.json({
      level: 1,
      currentStageScore: 100,
      requiredStageScore: 50,
    });
  }),

  // 펫 출석 체크
  http.post(`${baseURL}/members/me/pet/attendance`, () => {
    return HttpResponse.json();
  }),

  // ------------------ 하이라이트 CRUD ------------------

  // 전체 조회
  http.get(`${baseURL}/highlights`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    // 실제 서버처럼 최신순으로, size를 주지 않으면 10개씩 나눠 준다.
    const page = Number(searchParams.get('page') ?? 0);
    const size = Number(searchParams.get('size') ?? 10);
    const filtered = (
      articleId
        ? HIGHLIGHTS.filter((h) => h.articleId === Number(articleId))
        : [...HIGHLIGHTS]
    ).reverse();
    const content = filtered.slice(page * size, (page + 1) * size);
    const totalPages = Math.ceil(filtered.length / size);

    return HttpResponse.json({
      content,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: page * size,
        paged: true,
        unpaged: false,
      },
      totalElements: filtered.length,
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
    });
  }),

  // 글의 하이라이트 전체 조회
  http.get(`${baseURL}/articles/:articleId/highlights`, ({ params }) => {
    return HttpResponse.json(
      HIGHLIGHTS.filter((h) => h.articleId === Number(params.articleId)),
    );
  }),

  // 생성
  http.post(`${baseURL}/highlights`, async ({ request }) => {
    const newHighlight = (await request.json()) as Highlight;
    // 지운 뒤에도 id가 겹치지 않게 증가하는 값을 쓴다.
    lastHighlightId += 1;
    newHighlight.id = lastHighlightId;
    HIGHLIGHTS.push(newHighlight);
    return HttpResponse.json(newHighlight, { status: 201 });
  }),

  // 수정
  http.patch(`${baseURL}/highlights/:id`, async ({ request, params }) => {
    const { id } = params;
    const updated = (await request.json()) as Partial<Omit<Highlight, 'id'>>;

    const index = HIGHLIGHTS.findIndex((h) => h.id === Number(id));
    if (index === -1 || !HIGHLIGHTS[index]) {
      return new HttpResponse('Not Found', { status: 404 });
    }

    HIGHLIGHTS[index] = {
      ...HIGHLIGHTS[index],
      ...updated,
    };
    return HttpResponse.json(HIGHLIGHTS[index]);
  }),

  // 삭제
  http.delete(`${baseURL}/highlights/:id`, ({ params }) => {
    const { id } = params;
    const index = HIGHLIGHTS.findIndex((h) => h.id === Number(id));
    if (index === -1) {
      return new HttpResponse('Not Found', { status: 404 });
    }
    HIGHLIGHTS.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // 뉴스레터별 하이라이트 통계
  http.get(`${baseURL}/highlights/statistics/newsletters`, () => {
    const newsletterStats = {
      totalCount: 4,
      newsletters: [
        {
          id: 1,
          newsletter: '뉴닉',
          imageUrl: 'https://newneek.co/favicon.ico',
          count: 1,
        },
        {
          id: 2,
          newsletter: '디에디트',
          imageUrl: 'https://newneek.co/favicon.ico',
          count: 3,
        },
      ],
    };
    return HttpResponse.json(newsletterStats);
  }),
  ...blogHandlers,
  ...articleHandlers,
  ...newsletterDetailHandlers,
  ...bookmarkHandlers,
  ...membersHandlers,
  ...challengeHandlers,
  ...queueEntryHandlers,
  ...maeilMailHandlers,
  ...inquiryHandlers,
];
