import type {
  BlogDraftListItem,
  BlogPostListItem,
  BlogDraftDetail,
  CreateDraftResponse,
  UploadImageResponse,
} from '@/types/blog';

export const mockDrafts: BlogDraftListItem[] = [
  { postId: 1, title: '초안 글 1 - 아직 작성 중' },
  { postId: 2, title: '' },
  { postId: 3, title: '리액트 훅 정리' },
];

export const mockPosts: BlogPostListItem[] = [
  {
    postId: 10,
    title: '타입스크립트 제네릭 완벽 이해',
    description: '제네릭을 제대로 이해하면 타입 안전성이 크게 올라갑니다.',
    thumbnailImageUrl: null,
    categoryName: '개발',
    publishedAt: '2026-03-20T10:00:00Z',
  },
  {
    postId: 11,
    title: 'Tiptap v3 마이그레이션 후기',
    description: 'v2에서 v3으로 올리면서 겪은 이슈들을 정리했습니다.',
    thumbnailImageUrl: null,
    categoryName: '개발',
    publishedAt: '2026-03-28T09:00:00Z',
  },
  {
    postId: 12,
    title: '봄봄 서비스 오픈 회고',
    description: '3개월간의 개발 여정을 돌아봅니다.',
    thumbnailImageUrl: null,
    categoryName: '회고',
    publishedAt: '2026-04-01T00:00:00Z',
  },
];

export const mockDraftDetail: BlogDraftDetail = {
  title: '타입스크립트 제네릭 완벽 이해',
  content: JSON.stringify({
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: '제네릭이란?' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: '제네릭은 타입을 파라미터로 받아 재사용 가능한 컴포넌트를 만드는 방법입니다.',
          },
        ],
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: '기본 사용법' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'function identity<T>(arg: T): T { return arg; }',
            marks: [{ type: 'code' }],
          },
        ],
      },
    ],
  }),
  thumbnailImageUrl: null,
  category: { id: 1, name: '개발' },
  publishedAt: '2026-03-20T10:00:00Z',
  hashTags: ['TypeScript', '제네릭', '타입'],
  visibility: 'PUBLIC',
};

export const mockCreateDraftResponse: CreateDraftResponse = { postId: 99 };

export const mockUploadImageResponse: UploadImageResponse = {
  imageId: 1,
  imageUrl: 'https://placehold.co/800x400?text=Mock+Image',
};
