import { LONG_URL_ARTICLE_ID, MAEIL_MAIL_ARTICLE_ID } from './articleDetail';
import type { Article } from '@/types/articles';

export const ARTICLES: Article[] = [
  {
    articleId: MAEIL_MAIL_ARTICLE_ID,
    title: '[매일메일] React Suspense는 어떻게 동작하나요?',
    contentsSummary:
      '오늘의 매일메일 질문입니다. 글을 읽고 본인의 언어로 정답을 작성해보세요.',
    arrivedDateTime: '2026-04-26T09:00:00',
    thumbnailUrl: '',
    expectedReadTime: 4,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: '기술',
      name: '매일메일',
      imageUrl: 'https://example.com/images/maeil-mail.avif',
    },
  },
  {
    articleId: 5,
    title: '폭염에도 전력난 없는 이유는11111?',
    contentsSummary: '',
    arrivedDateTime: '2025-07-01T09:00:00',
    thumbnailUrl: '',
    expectedReadTime: 5,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: '기술',
      name: 'UPPITY',
      imageUrl: 'https://example.com/newsletter-image.jpg',
    },
  },
  {
    articleId: 2,
    title: '폭염에도 전력난 없는 이유는?',
    contentsSummary:
      '자동차 사이버보안 소프트웨어 솔루션 기업인 아우토크립트가 코스닥에 새로 상장해요. 15일 오늘까지 폴더블 스마트폰에 적용되는 초박형 강화유리를 주력사업으로 하는 도우인시스의 코스닥 공모주 청약이 있어요. 15~16일 양일간 자동차 사이버보안 소프트웨어 솔루션 기업인 아우토크립트가 코스닥에 새로 상장해요. 15일 오늘까지 폴더블 스마트폰에 적용되는 초박형 강화유리를 주력사업으로 하는 도우인시스의 코스닥 공모주 청약이 있어요. 15~16일 양일간',
    arrivedDateTime: '2025-07-01T09:00:00',
    thumbnailUrl:
      'https://img.freepik.com/free-vector/illustration-south-korea-flag_53876-27132.jpg',
    expectedReadTime: 5,
    isRead: true,
    isBookmarked: true,
    newsletter: {
      category: '기술',
      name: 'UPPITY',
      imageUrl: 'https://example.com/newsletter-image.jpg',
    },
  },
  {
    articleId: 3,
    title: '폭염에도 전력난 없는 이유는?',
    contentsSummary:
      '자동차 사이버보안 소프트웨어 솔루션 기업인 아우토크립트가 코스닥에 새로 상장해요. 15일 오늘까지 폴더블 스마트폰에 적용되는 초박형 강화유리를 주력사업으로 하는 도우인시스의 코스닥 공모주 청약이 있어요. 15~16일 양일간 자동차 사이버보안 소프트웨어 솔루션 기업인 아우토크립트가 코스닥에 새로 상장해요. 15일 오늘까지 폴더블 스마트폰에 적용되는 초박형 강화유리를 주력사업으로 하는 도우인시스의 코스닥 공모주 청약이 있어요. 15~16일 양일간',
    arrivedDateTime: '2025-07-01T09:00:00',
    thumbnailUrl:
      'https://img.freepik.com/free-vector/illustration-south-korea-flag_53876-27132.jpg',
    expectedReadTime: 5,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: '기술',
      name: 'UPPITY',
      imageUrl: 'https://example.com/newsletter-image.jpg',
    },
  },
  {
    articleId: 6,
    title: '일하는 방식을 바꾸는 생성형 AI 활용법',
    contentsSummary:
      '반복 업무를 줄이고 중요한 의사결정에 집중할 수 있는 생성형 AI 활용 사례를 소개합니다.',
    arrivedDateTime: '2026-07-19T09:00:00',
    thumbnailUrl:
      'https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-7000.jpg',
    expectedReadTime: 6,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: '커리어',
      name: '폴인레터',
      imageUrl: 'https://example.com/newsletter-image.jpg',
    },
  },
  {
    articleId: 7,
    title: '이번 주 꼭 알아야 할 경제 이슈 다섯 가지',
    contentsSummary:
      '한 주의 주요 경제 소식과 일상에 미치는 영향을 쉽고 빠르게 정리해드립니다.',
    arrivedDateTime: '2026-07-19T08:00:00',
    thumbnailUrl:
      'https://img.freepik.com/free-vector/business-analytics-concept-illustration_114360-878.jpg',
    expectedReadTime: 5,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: '경제',
      name: '어피티',
      imageUrl: 'https://example.com/newsletter-image.jpg',
    },
  },
  {
    articleId: LONG_URL_ARTICLE_ID,
    title: '[Korean FE Article] 고마워요, Deno',
    contentsSummary:
      '[Korean FE Article] 고마워요, Deno 글 링크: https://junghan92.medium.com/%EB%B2%88%EC%97%AD-%EA%B3%A0%EB%A7...',
    arrivedDateTime: '2026-11-04T08:31:50.088201',
    expectedReadTime: 5,
    isRead: false,
    isBookmarked: false,
    newsletter: {
      category: 'IT/테크',
      name: 'Korean FE Article',
      imageUrl:
        'https://substackcdn.com/image/fetch/$s_!0VPi!,w_176,h_176,c_fill,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F13b944aa-4b63-4c0e-97f0-23df3c2261a7_1280x1280.png',
    },
  },
];
