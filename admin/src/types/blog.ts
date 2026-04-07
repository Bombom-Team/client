import type { components } from './openapi';

export type BlogVisibility = NonNullable<
  components['schemas']['BlogDraftDetailResponse']['visibility']
>;

export type BlogDraftListItem =
  components['schemas']['BlogDraftListItemResponse'];

export type BlogDraftDetail = components['schemas']['BlogDraftDetailResponse'];

export type SaveDraftRequest = components['schemas']['UpdateBlogDraftRequest'];

export type UploadImageResponse =
  components['schemas']['UploadBlogDraftImageResponse'];

export type CreateDraftResponse =
  components['schemas']['CreateBlogDraftResponse'];

export type SetThumbnailRequest =
  components['schemas']['AssignBlogPostThumbnailRequest'];

// openapi에 정의되지 않은 타입들
export interface BlogPostListItem {
  postId: number;
  title: string;
  description: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
}
