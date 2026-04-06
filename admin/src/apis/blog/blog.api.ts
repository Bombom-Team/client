import { fetcher, ApiError } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type {
  BlogDraftListItem,
  BlogDraftDetail,
  BlogPostListItem,
  SaveDraftRequest,
  UploadImageResponse,
  SetThumbnailRequest,
  BlogVisibility,
  CreateDraftResponse,
} from '@/types/blog';
import type { Category } from '@/types/category';

type GetBlogPostsResponse =
  | PageableResponse<BlogPostListItem>
  | BlogPostListItem[];

type GetBlogCategoriesResponse = Array<{
  id: number;
  categoryName: string;
}>;

type GetBlogPostsParams = {
  page?: number;
  size?: number;
  sort?: string;
};

const PUBLIC_API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(
  '/admin/api/v1',
  '/api/v1',
);

// 1. 초안 생성
export const createDraft = async (): Promise<CreateDraftResponse> => {
  return fetcher.post<Record<string, never>, CreateDraftResponse>({
    path: '/blog/drafts',
    body: {},
  });
};

// 2. 이미지 업로드
// fetcher는 항상 Content-Type: application/json으로 설정하므로 FormData 업로드 시
// fetch를 직접 사용하여 브라우저가 multipart/form-data boundary를 자동 처리하게 한다.
export const uploadImage = async (
  postId: number,
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const url = new URL(ENV.baseUrl + `/blog/posts/${postId}/images`);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const contentType = response.headers.get('Content-Type');
    let errorMessage = `이미지 업로드에 실패했습니다. (${response.status})`;
    let rawBody;
    try {
      if (contentType?.includes('application/json')) {
        rawBody = await response.json();
        errorMessage = rawBody.message ?? errorMessage;
      } else {
        rawBody = await response.text();
        errorMessage = rawBody || errorMessage;
      }
    } catch {
      // 응답 파싱 실패 시 기본 메시지 사용
    }
    throw new ApiError(response.status, errorMessage, rawBody);
  }

  return response.json() as Promise<UploadImageResponse>;
};

// 3. 임시저장 (PUT)
export const saveDraft = async (
  postId: number,
  data: SaveDraftRequest,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.put<any, void>({
    path: `/blog/posts/${postId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: data as any,
  });
};

// 4. 임시저장 목록
export const getDrafts = async (): Promise<BlogDraftListItem[]> => {
  return fetcher.get<BlogDraftListItem[]>({ path: '/blog/drafts' });
};

// 5. 임시저장 글 상세
export const getDraftDetail = async (
  postId: number,
): Promise<BlogDraftDetail> => {
  return fetcher.get<BlogDraftDetail>({ path: `/blog/drafts/${postId}` });
};

export const getEditablePostDetail = async (
  postId: number,
): Promise<BlogDraftDetail> => {
  return fetcher.get<BlogDraftDetail>({ path: `/blog/posts/${postId}/edit` });
};

// 6. 발행
export const publishDraft = async (postId: number): Promise<void> => {
  return fetcher.post<Record<string, never>, void>({
    path: `/blog/drafts/${postId}/publish`,
    body: {},
  });
};

// 7. 삭제
export const deleteDraft = async (postId: number): Promise<void> => {
  return fetcher.delete<Record<string, never>, void>({
    path: `/blog/posts/${postId}`,
  });
};

// 8. 공개 범위 변경
export const updateVisibility = async (
  postId: number,
  visibility: BlogVisibility,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.patch<any, void>({
    path: `/blog/posts/${postId}/visibility`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: { visibility } as any,
  });
};

// 9. 썸네일 등록
export const setThumbnail = async (
  postId: number,
  data: SetThumbnailRequest,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.put<any, void>({
    path: `/blog/posts/${postId}/thumbnail`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: data as any,
  });
};

// 10. 발행된 글 목록 (admin prefix 없는 public API)
export const getBlogPosts = async (
  params: GetBlogPostsParams = {},
): Promise<BlogPostListItem[]> => {
  const response = await fetcher.get<GetBlogPostsResponse>({
    path: '/blog/posts',
    baseUrl: PUBLIC_API_BASE_URL,
    query: params,
  });

  return Array.isArray(response) ? response : (response.content ?? []);
};

export const getBlogCategories = async (): Promise<Category[]> => {
  const response = await fetcher.get<GetBlogCategoriesResponse>({
    path: '/blog/categories',
    baseUrl: PUBLIC_API_BASE_URL,
  });

  return response.map((category) => ({
    id: category.id,
    name: category.categoryName,
  }));
};
