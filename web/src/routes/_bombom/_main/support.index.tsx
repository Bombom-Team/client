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
  loader: async ({ context }) => {
    const faqs = await context.queryClient.ensureInfiniteQueryData(
      queries.infiniteFaqs({ faqCategory: undefined }),
    );
    return { faqs };
  },
  head: ({ loaderData }) => {
    const firstPage = loaderData?.faqs?.pages[0];
    const questions = firstPage?.content?.map((faq) => faq.question) ?? [];
    const description =
      questions.length > 0
        ? `${questions.slice(0, 3).join(', ')} 등 봄봄 자주 묻는 질문을 확인해보세요.`
        : '봄봄 서비스 이용 중 궁금한 점을 자주 묻는 질문에서 확인해보세요.';

    return {
      meta: [
        { title: '봄봄 | 고객센터' },
        { name: 'description', content: description },
        { name: 'robots', content: 'index, follow' },
      ],
      links: [{ rel: 'canonical', href: 'https://www.bombom.news/support' }],
    };
  },
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
