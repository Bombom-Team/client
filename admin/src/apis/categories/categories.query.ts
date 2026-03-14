import { queryOptions, useMutation } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from './categories.api';

const CATEGORIES_STALE_TIME = 1000 * 60;
const CATEGORIES_GC_TIME = 1000 * 60 * 5;

export const categoriesQueries = {
  all: ['categories'] as const,

  list: () =>
    queryOptions({
      queryKey: ['categories'] as const,
      queryFn: getCategories,
      staleTime: CATEGORIES_STALE_TIME,
      gcTime: CATEGORIES_GC_TIME,
    }),
};

export const useCreateCategoryMutation = () => {
  return useMutation({
    mutationFn: (payload: import('@/types/category').CreateCategoryParams) =>
      createCategory(payload),
  });
};

export const useUpdateCategoryMutation = () => {
  return useMutation({
    mutationFn: (payload: import('@/types/category').UpdateCategoryParams) =>
      updateCategory(payload),
  });
};

export const useDeleteCategoryMutation = () => {
  return useMutation({
    mutationFn: deleteCategory,
  });
};
