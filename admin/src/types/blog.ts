export type BlogVisibility = 'PUBLIC' | 'PRIVATE';

export interface BlogDraftListItem {
  postId: number;
  title: string;
}

export interface BlogPostListItem {
  postId: number;
  title: string;
  description: string;
  thumbnailImageUrl: string | null;
  categoryName: string;
  publishedAt: string;
}

export interface BlogDraftDetail {
  title: string;
  content: string; // ProseMirror JSON 문자열
  thumbnailImageUrl: string | null;
  category: { id: number; name: string } | null;
  publishedAt: string;
  hashTags: string[];
  visibility: BlogVisibility; // 기존 공개 범위 복원용
}

export interface SaveDraftRequest {
  title: string;
  content: string; // JSON.stringify(editor.getJSON())
  thumbnailImageId: number | null;
  categoryId: number | null;
  hashTags: string[];
  referencedImageIds: number[];
}

export interface UploadImageResponse {
  imageId: number;
  imageUrl: string;
}

export interface SetThumbnailRequest {
  imageId: number;
}

export interface UpdateVisibilityRequest {
  visibility: BlogVisibility;
}

export interface CreateDraftResponse {
  postId: number;
}
