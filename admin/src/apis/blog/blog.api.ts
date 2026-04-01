import { fetcher } from '@bombom/shared/apis';
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

// 1. 초안 생성
export const createDraft = async (): Promise<CreateDraftResponse> => {
  return fetcher.post<Record<string, never>, CreateDraftResponse>({
    path: '/blog/drafts',
    body: {},
  });
};

// 2. 이미지 업로드
export const uploadImage = async (
  postId: number,
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.post<any, UploadImageResponse>({
    path: `/blog/drafts/${postId}/images`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: formData as any,
  });
};

// 3. 임시저장 (PUT)
export const saveDraft = async (
  postId: number,
  data: SaveDraftRequest,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.put<any, void>({
    path: `/blog/drafts/${postId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: data as any,
  });
};

// 4. 임시저장 목록
export const getDrafts = async (): Promise<BlogDraftListItem[]> => {
  return fetcher.get<BlogDraftListItem[]>({ path: '/blog/drafts' });
};

// 5. 임시저장 글 상세
export const getDraftDetail = async (postId: number): Promise<BlogDraftDetail> => {
  return fetcher.get<BlogDraftDetail>({ path: `/blog/drafts/${postId}` });
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
    path: `/blog/drafts/${postId}`,
  });
};

// 8. 공개 범위 변경
export const updateVisibility = async (
  postId: number,
  visibility: BlogVisibility,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fetcher.patch<any, void>({
    path: `/blog/drafts/${postId}/visibility`,
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
  return fetcher.post<any, void>({
    path: `/blog/drafts/${postId}/thumbnail`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: data as any,
  });
};

// 10. 발행된 글 목록 (신규 백엔드 API)
export const getBlogPosts = async (): Promise<BlogPostListItem[]> => {
  return fetcher.get<BlogPostListItem[]>({ path: '/blog/posts' });
};
