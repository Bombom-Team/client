import { MAEIL_MAIL_ARTICLE_ID } from './articleDetail';
import type { Article } from '@/types/articles';

export const ARTICLES: Article[] = [
  {
    articleId: MAEIL_MAIL_ARTICLE_ID,
    title: '[매일메일] React Suspense는 어떻게 동작하나요?',
    contentsSummary:
      '오늘의 매일메일 질문입니다. 글을 읽고 본인의 언어로 정답을 작성해보세요.',
    arrivedDateTime: '2026.04.26',
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
    arrivedDateTime: '2025.07.01',
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
    arrivedDateTime: '2025.07.01',
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
    arrivedDateTime: '2025.07.01',
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
];
