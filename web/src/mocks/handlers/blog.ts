import { delay, http, HttpResponse } from 'msw';
import { BLOG_POST_CONTENT, BLOG_POST_DETAILS } from '../datas/blogPosts';
import { ENV } from '@/apis/env';

const BLOG_MOCK_DELAY_MS = 300;
const baseURL = ENV.baseUrl;

export const blogHandlers = [
  http.get(`${baseURL}/blog/posts`, async ({ request }) => {
    await delay(BLOG_MOCK_DELAY_MS);

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 6);

    const totalElements = BLOG_POST_CONTENT.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = BLOG_POST_CONTENT.slice(start, end);

    return HttpResponse.json({
      content,
      totalElements,
      totalPages,
      number: page,
      size,
      first: page === 0,
      last: page >= totalPages - 1,
      numberOfElements: content.length,
      empty: content.length === 0,
    });
  }),

  http.get(`${baseURL}/blog/posts/:postId`, async ({ params }) => {
    await delay(BLOG_MOCK_DELAY_MS);

    const postId =
      typeof params.postId === 'string' ? params.postId : params.postId?.[0];
    const post = postId ? BLOG_POST_DETAILS[postId] : undefined;

    if (!post) {
      return HttpResponse.json(
        { message: '해당 글을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return HttpResponse.json(post);
  }),
];
