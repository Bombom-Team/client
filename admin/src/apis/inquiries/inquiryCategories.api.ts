import { fetcher } from '@bombom/shared/apis';
import type {
  InquiryCategory,
  CreateInquiryCategoryParams,
  UpdateInquiryCategoryParams,
} from '@/types/inquiry';

export const getInquiryCategories = async () => {
  return fetcher.get<InquiryCategory[]>({
    path: '/inquiries/categories',
  });
};

export const createInquiryCategory = async (
  payload: CreateInquiryCategoryParams,
) => {
  return fetcher.post({
    path: '/inquiries/categories',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: payload as any,
  });
};

export const updateInquiryCategory = async ({
  id,
  ...payload
}: UpdateInquiryCategoryParams) => {
  return fetcher.patch({
    path: `/inquiries/categories/${id}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: payload as any,
  });
};

export const deleteInquiryCategory = async (id: number) => {
  return fetcher.delete({
    path: `/inquiries/categories/${id}`,
  });
};
