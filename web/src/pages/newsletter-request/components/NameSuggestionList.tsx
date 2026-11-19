import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const hasResults = requests.length > 0 || newsletters.length > 0;

  // 모바일은 키보드에 결과가 가려지기 쉬워서, 결과가 처음 뜰 때 보이는 곳으로 올린다.
  useEffect(() => {
    if (isMobile && hasResults) {
      containerRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isMobile, hasResults]);

  if (!hasResults) return null;

  return (
    <Container ref={containerRef} isPanel={!isMobile} aria-live="polite">
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
        <Section aria-label="다른 사람이 신청했어요">
          <SectionLabel>다른 사람이 신청했어요</SectionLabel>
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

  scroll-margin-bottom: 96px;

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
