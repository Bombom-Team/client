import type { components, operations } from './openapi';

export type BlogVisibility = NonNullable<
  components['schemas']['BlogDraftDetailResponse']['visibility']
>;
export type BlogPostStatus = NonNullable<
  components['schemas']['BlogPostListItemResponse']['status']
>;

export type BlogDraftListItem =
  components['schemas']['BlogDraftListItemResponse'];

export type BlogDraftDetail = components['schemas']['BlogDraftDetailResponse'];
export type BlogPostListItem =
  components['schemas']['BlogPostListItemResponse'];
export type BlogPostDetail = components['schemas']['BlogPostDetailResponse'];
export type GetBlogPostsParams = NonNullable<
  operations['getPosts']['parameters']['query']
>;

export type SaveDraftRequest = components['schemas']['UpdateBlogDraftRequest'];

export type UploadImageResponse =
  components['schemas']['UploadBlogDraftImageResponse'];

export type CreateDraftResponse =
  components['schemas']['CreateBlogDraftResponse'];

export type SetThumbnailRequest =
  components['schemas']['AssignBlogPostThumbnailRequest'];
