import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import Accordion from '@/components/Accordion/Accordion';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import PCHeader from '@/components/Header/PCHeader';
import { useDevice } from '@/hooks/useDevice';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';
import FaqCategoryFilter from '@/pages/support/components/FaqCategoryFilter';
import type { FaqCategoryType } from '@/types/faq';

export const Route = createFileRoute('/support')({
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
  component: SupportPage,
});

function SupportPage() {
  useWebViewRegisterToken();

  const device = useDevice();
  const isMobile = device !== 'pc';
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

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleToggleFaq = (faqId: number) => {
    setOpenFaqId((prev) => (prev === faqId ? null : faqId));
  };

  return (
    <>
      {device === 'pc' ? <PCHeader activeNav={null} /> : <MobileMainHeader />}
      <Container isMobile={isMobile}>
        <Title>고객센터</Title>

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
                      <CategoryText>[{faq.categoryName}]</CategoryText>{' '}
                      {faq.question}
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
      </Container>

      <AppInstallPromptModal />
    </>
  );
}

const Container = styled.main<{ isMobile: boolean }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 24px) 16px 24px`
      : `calc(${theme.heights.headerPC} + 40px + 24px) 16px 24px`};

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

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

const CategoryText = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const AnswerText = styled.p`
  width: 100%;
`;
