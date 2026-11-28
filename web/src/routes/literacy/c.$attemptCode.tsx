import { createFileRoute, redirect } from '@tanstack/react-router';
import { CHALLENGE_UTM } from '@/pages/literacy-quiz/constants/links';

// 도전장 공유 링크. CloudFront가 서버 OG 페이지로 보내기 전까지는 여기서 바로 퀴즈로 넘긴다.
export const Route = createFileRoute('/literacy/c/$attemptCode')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/literacy',
      search: { c: params.attemptCode, ...CHALLENGE_UTM },
      replace: true,
    });
  },
});
