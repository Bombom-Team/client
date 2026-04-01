import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createDraft,
  deleteDraft,
  getDraftDetail,
  getDrafts,
  getBlogPosts,
  publishDraft,
  saveDraft,
  setThumbnail,
  updateVisibility,
  uploadImage,
} from './blog.api';
import {
  mockDrafts,
  mockPosts,
  mockDraftDetail,
  mockCreateDraftResponse,
  mockUploadImageResponse,
} from './blog.mock';
import type {
  SaveDraftRequest,
  BlogVisibility,
  SetThumbnailRequest,
} from '@/types/blog';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const STALE_TIME = 1000 * 60;
const GC_TIME = 1000 * 60 * 5;

export const blogQueries = {
  drafts: () =>
    queryOptions({
      queryKey: ['blog', 'drafts'] as const,
      queryFn: USE_MOCK ? () => Promise.resolve(mockDrafts) : getDrafts,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  draft: (postId: number) =>
    queryOptions({
      queryKey: ['blog', 'draft', postId] as const,
      queryFn: USE_MOCK
        ? () => Promise.resolve(mockDraftDetail)
        : () => getDraftDetail(postId),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  posts: () =>
    queryOptions({
      queryKey: ['blog', 'posts'] as const,
      queryFn: USE_MOCK ? () => Promise.resolve(mockPosts) : getBlogPosts,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),
};

export const useCreateDraft = () =>
  useMutation({
    mutationFn: USE_MOCK
      ? () => Promise.resolve(mockCreateDraftResponse)
      : createDraft,
  });

export const useSaveDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: SaveDraftRequest;
    }) => (USE_MOCK ? Promise.resolve() : saveDraft(postId, data)),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'draft', postId] });
    },
  });
};

export const usePublishDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) =>
      USE_MOCK ? Promise.resolve() : publishDraft(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) =>
      USE_MOCK ? Promise.resolve() : deleteDraft(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
    },
  });
};

export const useUpdateVisibility = () =>
  useMutation({
    mutationFn: ({
      postId,
      visibility,
    }: {
      postId: number;
      visibility: BlogVisibility;
    }) => (USE_MOCK ? Promise.resolve() : updateVisibility(postId, visibility)),
    // onSuccess: 에디터 로컬 상태만 업데이트 — 목록 쿼리 invalidate 불필요
  });

export const useUploadImage = () =>
  useMutation({
    mutationFn: ({ postId, file }: { postId: number; file: File }) =>
      USE_MOCK
        ? Promise.resolve(mockUploadImageResponse)
        : uploadImage(postId, file),
  });

export const useSetThumbnail = () =>
  useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: SetThumbnailRequest;
    }) => (USE_MOCK ? Promise.resolve() : setThumbnail(postId, data)),
  });
