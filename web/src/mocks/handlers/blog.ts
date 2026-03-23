import { delay, http, HttpResponse } from 'msw';
import { BLOG_POST_DETAILS, BLOG_POST_LIST } from '../datas/blogPosts';
import { ENV } from '@/apis/env';

const BLOG_MOCK_DELAY_MS = 300;
const baseURL = ENV.baseUrl;

export const blogHandlers = [
  http.get(`${baseURL}/blog/posts`, async () => {
    await delay(BLOG_MOCK_DELAY_MS);

    return HttpResponse.json(BLOG_POST_LIST);
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
