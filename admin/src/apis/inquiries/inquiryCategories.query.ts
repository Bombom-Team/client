import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createInquiryCategory,
  deleteInquiryCategory,
  getInquiryCategories,
  updateInquiryCategory,
} from './inquiryCategories.api';
import type {
  CreateInquiryCategoryParams,
  UpdateInquiryCategoryParams,
} from '@/types/inquiry';

const INQUIRY_CATEGORIES_STALE_TIME = 1000 * 60;
const INQUIRY_CATEGORIES_GC_TIME = 1000 * 60 * 5;

export const inquiryCategoriesQueries = {
  all: ['inquiryCategories'] as const,

  list: () =>
    queryOptions({
      queryKey: ['inquiryCategories'] as const,
      queryFn: getInquiryCategories,
      staleTime: INQUIRY_CATEGORIES_STALE_TIME,
      gcTime: INQUIRY_CATEGORIES_GC_TIME,
    }),
};

export const useCreateInquiryCategoryMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateInquiryCategoryParams) =>
      createInquiryCategory(payload),
  });
};

export const useUpdateInquiryCategoryMutation = () => {
  return useMutation({
    mutationFn: (payload: UpdateInquiryCategoryParams) =>
      updateInquiryCategory(payload),
  });
};

export const useDeleteInquiryCategoryMutation = () => {
  return useMutation({
    mutationFn: deleteInquiryCategory,
  });
};
