import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type UnsubscribePattern =
  components['schemas']['UnsubscribePatternResponse'];
export type CreateUnsubscribePatternRequest =
  components['schemas']['UnsubscribePatternRequest'];
export type UpdateUnsubscribePatternRequest =
  components['schemas']['UnsubscribePatternUpdateRequest'];

export const getUnsubscribePatterns = async () => {
  return fetcher.get<UnsubscribePattern[]>({
    path: '/unsubscribe-patterns',
  });
};

export const getUnsubscribePattern = async (id: number) => {
  return fetcher.get<UnsubscribePattern>({
    path: `/unsubscribe-patterns/${id}`,
  });
};

export const createUnsubscribePattern = async (
  data: CreateUnsubscribePatternRequest,
) => {
  return fetcher.post<CreateUnsubscribePatternRequest, void>({
    path: '/unsubscribe-patterns',
    body: data,
  });
};

export const updateUnsubscribePattern = async ({
  id,
  patternValue,
}: {
  id: number;
  patternValue: string;
}) => {
  return fetcher.patch<UpdateUnsubscribePatternRequest, void>({
    path: `/unsubscribe-patterns/${id}`,
    body: { patternValue },
  });
};
