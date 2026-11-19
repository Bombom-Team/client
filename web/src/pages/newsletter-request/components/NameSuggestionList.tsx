import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import RegisteredNewsletterCard from './RegisteredNewsletterCard';
import RequestedNewsletterRow from './RequestedNewsletterRow';
import type {
  NewsletterRequest,
  NewsletterSuggestion,
} from '@/apis/newsletterRequests/newsletterRequests.api';

interface NameSuggestionListProps {
  keyword: string;
  requests: NewsletterRequest[];
  newsletters: NewsletterSuggestion[];
  isLikePending: boolean;
  onLike: (request: NewsletterRequest) => void;
}

// 이름을 치는 동안 입력창 아래에 검색 결과처럼 보여준다.
// 이미 봄봄에 있는 뉴스레터는 여기서 바로 구독하고, 신청 중인 뉴스레터는 바로 공감할 수 있다.
const NameSuggestionList = ({
  keyword,
  requests,
  newsletters,
  isLikePending,
  onLike,
}: NameSuggestionListProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const hasResults = requests.length > 0 || newsletters.length > 0;

  if (!hasResults) return null;

  return (
    <Container isPanel={!isMobile}>
      {newsletters.length > 0 && (
        <Section aria-label="봄봄에 이미 있어요">
          <SectionLabel>봄봄에 이미 있어요</SectionLabel>
          {newsletters.map((newsletter) => (
            <RegisteredNewsletterCard
              key={newsletter.newsletterId}
              newsletterId={newsletter.newsletterId}
              name={newsletter.name}
              imageUrl={newsletter.imageUrl}
              keyword={keyword}
              variant={isMobile ? 'card' : 'row'}
            />
          ))}
        </Section>
      )}
      {requests.length > 0 && (
        <Section aria-label="신청 중이에요">
          <SectionLabel>신청 중이에요</SectionLabel>
          {requests.map((request) => (
            <RequestedNewsletterRow
              key={request.id}
              request={request}
              keyword={keyword}
              isLikePending={isLikePending}
              onLike={onLike}
            />
          ))}
        </Section>
      )}
    </Container>
  );
};

export default NameSuggestionList;

const Container = styled.div<{ isPanel: boolean }>`
  display: flex;
  gap: 20px;
  flex-direction: column;


  ${({ isPanel, theme }) =>
    isPanel &&
    `
    padding: 12px;
    border: 1px solid ${theme.colors.stroke};
    border-radius: 16px;
    box-shadow: 0 12px 32px rgb(0 0 0 / 8%);

    gap: 12px;

    background-color: ${theme.colors.white};
  `}
`;

const Section = styled.section`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const SectionLabel = styled.h2`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Bold};
`;
