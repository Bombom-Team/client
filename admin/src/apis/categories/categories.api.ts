import { fetcher } from '@bombom/shared/apis';
import type {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from '@/types/category';

export const getCategories = async () => {
  return fetcher.get<Category[]>({
    path: '/categories',
  });
};

export const createCategory = async (payload: CreateCategoryParams) => {
  return fetcher.post({
    path: '/categories',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: payload as any,
  });
};

export const updateCategory = async ({
  id,
  ...payload
}: UpdateCategoryParams) => {
  return fetcher.patch({
    path: `/categories/${id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: payload as any,
  });
};

export const deleteCategory = async (id: number) => {
  return fetcher.delete({
    path: `/categories/${id}`,
  });
};
