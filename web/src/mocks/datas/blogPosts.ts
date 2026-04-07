import type { PostListItem } from '@/apis/blog/blog.api';
import type { components } from '@/types/openapi';

type BlogPostDetail = components['schemas']['BlogPostDetailResponse'];

export const BLOG_POST_CONTENT: PostListItem[] = [
  {
    postId: 1,
    title: '페이스페이가 그리는 결제의 새 얼굴',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    description: '일상을 바꾸는 결제의 진화, 더 안전하고 편리하게',
  },
  {
    postId: 2,
    title: '이번 주 놓치면 안 될 뉴스레터 TOP 3',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400',
    categoryName: '뉴스레터 추천',
    publishedAt: '2026-03-14T10:00:00Z',
    description: '지식의 깊이를 더해주는 이번 주의 추천 뉴스레터 목록입니다.',
  },
  {
    postId: 3,
    title: '구독자 인터뷰: "봄봄과 함께 성장하는 즐거움"',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    categoryName: '구독자 인터뷰',
    publishedAt: '2026-03-12T10:00:00Z',
    description:
      '봄봄을 1년째 구독 중인 김철수 님을 만나 그의 성장 이야기를 들어보았습니다.',
  },
  {
    postId: 4,
    title: '생산성을 높여주는 추천 도서 5권',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-10T10:00:00Z',
    description:
      '업무 효율을 극대화하고 삶의 질을 높여주는 필독서 5권을 추천합니다.',
  },
  {
    postId: 5,
    title: 'SEO를 위한 콘텐츠 작성 가이드',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
    categoryName: '뉴스레터 추천',
    publishedAt: '2026-03-08T10:00:00Z',
    description:
      '당신의 콘텐츠가 검색 결과 상단에 노출되기 위한 핵심 SEO 전략을 공개합니다.',
  },
  {
    postId: 6,
    title: '2026년 주목해야 할 스타트업 트렌드',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    categoryName: '트렌드 분석',
    publishedAt: '2026-03-05T10:00:00Z',
    description: '올해 주목할 스타트업 트렌드를 분석합니다.',
  },
  {
    postId: 7,
    title: '뉴스레터 마케팅의 미래',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1432888622747-4eb9a8f5a07d?w=400',
    categoryName: '트렌드 분석',
    publishedAt: '2026-03-03T10:00:00Z',
    description:
      '이메일 마케팅이 아직도 유효한 이유와 앞으로의 전략을 살펴봅니다.',
  },
  {
    postId: 8,
    title: '개발자가 읽어야 할 뉴스레터 5선',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    categoryName: '뉴스레터 추천',
    publishedAt: '2026-03-01T10:00:00Z',
    description:
      '개발 트렌드와 기술 인사이트를 제공하는 필수 뉴스레터 목록입니다.',
  },
  {
    postId: 9,
    title: '콘텐츠 큐레이션 잘하는 법',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-02-27T10:00:00Z',
    description: '방대한 정보 속에서 가치 있는 콘텐츠를 선별하는 5가지 원칙.',
  },
  {
    postId: 10,
    title: '봄봄 2026 상반기 업데이트 미리보기',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    categoryName: '봄봄 소식',
    publishedAt: '2026-02-24T10:00:00Z',
    description: '봄봄이 준비 중인 새로운 기능들을 미리 만나보세요.',
  },
  {
    postId: 11,
    title: '읽기 습관 만들기 30일 챌린지 후기',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    categoryName: '구독자 인터뷰',
    publishedAt: '2026-02-21T10:00:00Z',
    description: '매일 뉴스레터 읽기를 30일간 실천한 구독자의 생생한 후기.',
  },
  {
    postId: 12,
    title: '좋은 뉴스레터의 조건',
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400',
    categoryName: '트렌드 분석',
    publishedAt: '2026-02-18T10:00:00Z',
    description:
      '독자를 계속 구독하게 만드는 뉴스레터의 핵심 요소를 분석합니다.',
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

export const BLOG_POST_DETAILS: Record<string, BlogPostDetail> = {
  '1': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
  '2': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
  '3': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
  '4': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
  '5': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
  '6': {
    title: '페이스페이가 그리는 결제의 새 얼굴',
    content: POST_CONTENT,
    thumbnailImageUrl:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    categoryName: '추천 콘텐츠',
    publishedAt: '2026-03-18T10:00:00Z',
    hashTags: ['결제', '핀테크'],
  },
};
