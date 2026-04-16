import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createDraft,
  deleteDraft,
  getEditablePostDetail,
  getDraftDetail,
  getPostDetail,
  getDrafts,
  getBlogCategories,
  getBlogPosts,
  publishDraft,
  saveDraft,
  setThumbnail,
  updateVisibility,
  uploadImage,
} from './blog.api';
import type {
  SaveDraftRequest,
  BlogVisibility,
  SetThumbnailRequest,
} from '@/types/blog';

const STALE_TIME = 1000 * 60;
const GC_TIME = 1000 * 60 * 5;

export const blogQueries = {
  drafts: () =>
    queryOptions({
      queryKey: ['blog', 'drafts'] as const,
      queryFn: getDrafts,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  draft: (postId: number) =>
    queryOptions({
      queryKey: ['blog', 'draft', postId] as const,
      queryFn: () => getDraftDetail(postId),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  editablePost: (postId: number) =>
    queryOptions({
      queryKey: ['blog', 'editable-post', postId] as const,
      queryFn: () => getEditablePostDetail(postId),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  post: (postId: number) =>
    queryOptions({
      queryKey: ['blog', 'post', postId] as const,
      queryFn: () => getPostDetail(postId),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  posts: () =>
    queryOptions({
      queryKey: ['blog', 'posts'] as const,
      queryFn: () => getBlogPosts(),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),

  categories: () =>
    queryOptions({
      queryKey: ['blog', 'categories'] as const,
      queryFn: getBlogCategories,
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
    }),
};

export const useCreateDraft = () =>
  useMutation({
    mutationFn: createDraft,
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
    }) => saveDraft(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'draft', postId] });
      queryClient.invalidateQueries({
        queryKey: ['blog', 'editable-post', postId],
      });
    },
  });
};

export const usePublishDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => publishDraft(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => deleteDraft(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'drafts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
    },
  });
};

export const useUpdateVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      visibility,
    }: {
      postId: number;
      visibility: BlogVisibility;
    }) => updateVisibility(postId, visibility),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'post', postId] });
    },
  });
};

export const useUploadImage = () =>
  useMutation({
    mutationFn: ({ postId, file }: { postId: number; file: File }) =>
      uploadImage(postId, file),
  });

export const useSetThumbnail = () =>
  useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: SetThumbnailRequest;
    }) => setThumbnail(postId, data),
  });
