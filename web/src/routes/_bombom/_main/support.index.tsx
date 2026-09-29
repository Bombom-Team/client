import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import Accordion from '@/components/Accordion/Accordion';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import FaqCategoryFilter from '@/pages/support/components/FaqCategoryFilter';
import type { FaqCategoryType } from '@/types/faq';

export const Route = createFileRoute('/_bombom/_main/support/')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 고객센터',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryType | 'ALL'>(
    'ALL',
  );
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: faqPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    queries.infiniteFaqs({
      faqCategory: activeCategory === 'ALL' ? undefined : activeCategory,
    }),
  );

  const faqs = useMemo(
    () => faqPages?.pages.flatMap((page) => page?.content ?? []) ?? [],
    [faqPages],
  );

  useIntersectionTrigger({
    targetRef: loadMoreRef,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const handleToggleFaq = (faqId: number) => {
    setOpenFaqId((prev) => (prev === faqId ? null : faqId));
  };

  return (
    <ContentWrapper>
      <FaqCategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <FaqListWrapper>
        {faqs.map((faq) => {
          const isOpen = openFaqId === faq.faqId;

          return (
            <Accordion key={faq.faqId}>
              <Accordion.Header
                isOpen={isOpen}
                onToggle={() => handleToggleFaq(faq.faqId)}
              >
                <QuestionText>
                  <QuestionMark>Q.</QuestionMark> {faq.question}
                </QuestionText>
              </Accordion.Header>

              <Accordion.Content isOpen={isOpen}>
                <AnswerText>{faq.answer}</AnswerText>
              </Accordion.Content>
            </Accordion>
          );
        })}

        <LoadMoreTrigger ref={loadMoreRef} />
      </FaqListWrapper>
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 20px;
`;

const FaqListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionText = styled.span`
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const QuestionMark = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const AnswerText = styled.p`
  width: 100%;
`;
