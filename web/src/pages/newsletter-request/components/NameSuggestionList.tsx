import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type {
  NewsletterRequest,
  NewsletterSuggestion,
} from '@/types/newsletterRequest';

interface NameSuggestionListProps {
  keyword: string;
  onRequestSelect: (request: NewsletterRequest) => void;
  onNewsletterSelect: (newsletter: NewsletterSuggestion) => void;
}

const SUGGESTION_DEBOUNCE_MS = 300;

const NameSuggestionList = ({
  keyword,
  onRequestSelect,
  onNewsletterSelect,
}: NameSuggestionListProps) => {
  const debouncedKeyword = useDebouncedValue(keyword, SUGGESTION_DEBOUNCE_MS);
  const { data } = useQuery(
    queries.newsletterRequestSuggestions({ keyword: debouncedKeyword }),
  );

  const requests = data?.requests ?? [];
  const newsletters = data?.newsletters ?? [];
  if (requests.length === 0 && newsletters.length === 0) return null;

  return (
    <Container aria-live="polite">
      <Label>혹시 이 뉴스레터인가요?</Label>
      {newsletters.map((newsletter) => (
        <SuggestionButton
          key={`newsletter-${newsletter.newsletterId}`}
          type="button"
          onClick={() => onNewsletterSelect(newsletter)}
        >
          <SuggestionName>{newsletter.name}</SuggestionName>
          <SuggestionMeta>이미 봄봄에 있어요</SuggestionMeta>
        </SuggestionButton>
      ))}
      {requests.map((request) => (
        <SuggestionButton
          key={`request-${request.id}`}
          type="button"
          onClick={() => onRequestSelect(request)}
        >
          <SuggestionName>{request.name}</SuggestionName>
          <SuggestionMeta>신청 {request.supporterCount}명</SuggestionMeta>
        </SuggestionButton>
      ))}
    </Container>
  );
};

export default NameSuggestionList;

const Container = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const SuggestionButton = styled.button`
  padding: 12px 8px;
  border-radius: 12px;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  text-align: left;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const SuggestionName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const SuggestionMeta = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;
