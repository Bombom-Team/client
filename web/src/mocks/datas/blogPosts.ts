import type { PostDetail } from '@/pages/blog/types/post';

export const BLOG_POST_LIST = [
  {
    postId: '1',
    title: '페이스페이가 그리는 결제의 새 얼굴',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    description: '일상을 바꾸는 결제의 진화, 더 안전하고 편리하게',
  },
  {
    postId: '2',
    title: '이번 주 놓치면 안 될 뉴스레터 TOP 3',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
    categoryName: '뉴스레터 추천',
    publishedAt: '2026-03-14T10:00:00Z',
    readingTime: 5,
    description: '지식의 깊이를 더해주는 이번 주의 추천 뉴스레터 목록입니다.',
  },
  {
    postId: '3',
    title: '구독자 인터뷰: "봄봄과 함께 성장하는 즐거움"',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    categoryName: '구독자 인터뷰',
    publishedAt: '2026-03-12T10:00:00Z',
    readingTime: 7,
    description:
      '봄봄을 1년째 구독 중인 김철수 님을 만나 그의 성장 이야기를 들어보았습니다.',
  },
  {
    postId: '4',
    title: '생산성을 높여주는 추천 도서 5권',
    thumbnailImageUrl: null,
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-10T10:00:00Z',
    readingTime: 6,
    description:
      '업무 효율을 극대화하고 삶의 질을 높여주는 필독서 5권을 추천합니다.',
  },
  {
    postId: '5',
    title: 'SEO를 위한 콘텐츠 작성 가이드',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    categoryName: '뉴스레터 추천',
    publishedAt: '2026-03-08T10:00:00Z',
    readingTime: 10,
    description:
      '당신의 콘텐츠가 검색 결과 상단에 노출되기 위한 핵심 SEO 전략을 공개합니다.',
  },
  {
    postId: '6',
    title: '2026년 주목해야 할 스타트업 트렌드',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    categoryName: '트렌드 분석',
    publishedAt: '2026-03-05T10:00:00Z',
    readingTime: 8,
    description: '올해 주목할 스타트업 트렌드를 분석합니다.',
  },
];

const POST_CONTENT = `페이스페이는 우리의 일상을 바꾸고 있습니다. 단순히 카드를 긁거나 현금을 건네는 것이 아니라, 얼굴 인식만으로 결제가 가능한 시대가 왔습니다.

결제의 진화
더 안전하고 편리한 결제 방식이 우리의 소비 패턴을 완전히 바꾸고 있습니다.

기술의 핵심
- 생체 인식 기술로 빠르고 정확한 본인 확인
- AI 기반 보안 시스템으로 더욱 강화된 안전성
- 실시간 거래 처리로 즉각적인 결제 완료

사용자 경험의 혁신
페이스페이를 사용하는 사용자들은 평균 2초 이내에 결제를 완료합니다. 지갑을 꺼낼 필요도, 카드를 찾을 필요도 없습니다.

이러한 혁신은 단순히 편의성을 넘어, 우리의 생활 방식 자체를 변화시키고 있습니다. 앞으로 결제는 더욱 자연스럽고 직관적인 경험이 될 것입니다.`;

export const BLOG_POST_DETAILS: Record<string, PostDetail> = {
  '1': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
  '2': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
  '3': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
  '4': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
  '5': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
  '6': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    readingTime: 8,
    hashTags: ['결제', '핀테크'],
  },
};
