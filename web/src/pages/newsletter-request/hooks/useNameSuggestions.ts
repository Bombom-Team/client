import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queries } from '@/apis/queries';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type {
  NewsletterRequest,
  NewsletterSuggestion,
} from '@/apis/newsletterRequests/newsletterRequests.api';

const SUGGESTION_DEBOUNCE_MS = 300;
const EMPTY_REQUESTS: NewsletterRequest[] = [];
const EMPTY_NEWSLETTERS: NewsletterSuggestion[] = [];

// 이름 단계의 검색 결과. 퍼널(하단 버튼 문구)과 목록이 같은 결과를 본다.
const useNameSuggestions = (keyword: string) => {
  const debouncedKeyword = useDebouncedValue(keyword, SUGGESTION_DEBOUNCE_MS);
  const { data } = useQuery(
    queries.newsletterRequestSuggestions({ keyword: debouncedKeyword }),
  );

  return useMemo(() => {
    const requests = data?.requests ?? EMPTY_REQUESTS;
    const newsletters = data?.newsletters ?? EMPTY_NEWSLETTERS;
    return {
      keyword: debouncedKeyword,
      requests,
      newsletters,
      hasResults: requests.length > 0 || newsletters.length > 0,
    };
  }, [data, debouncedKeyword]);
};

export default useNameSuggestions;
