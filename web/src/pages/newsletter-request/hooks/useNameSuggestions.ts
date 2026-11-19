import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const SUGGESTION_DEBOUNCE_MS = 300;

// 이름 단계의 검색 결과. 퍼널(하단 버튼 문구)과 목록이 같은 결과를 본다.
const useNameSuggestions = (keyword: string) => {
  const debouncedKeyword = useDebouncedValue(keyword, SUGGESTION_DEBOUNCE_MS);
  const { data } = useQuery(
    queries.newsletterRequestSuggestions({ keyword: debouncedKeyword }),
  );

  const requests = data?.requests ?? [];
  const newsletters = data?.newsletters ?? [];

  return {
    keyword: debouncedKeyword,
    requests,
    newsletters,
    hasResults: requests.length > 0 || newsletters.length > 0,
  };
};

export default useNameSuggestions;
