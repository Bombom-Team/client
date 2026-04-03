import type { components } from '@/types/openapi';

export type PostListItem = components['schemas']['BlogPostResponse'];
export type PostDetail = components['schemas']['BlogPostDetailResponse'];

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}
