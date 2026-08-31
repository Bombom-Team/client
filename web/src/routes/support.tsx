import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Accordion from '@/components/Accordion/Accordion';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import PCHeader from '@/components/Header/PCHeader';
import { useDevice } from '@/hooks/useDevice';
import { showMessenger } from '@/libs/channelTalk/channelTalk.utils';
import FaqCategoryFilter from '@/pages/support/components/FaqCategoryFilter';
import SupportContactCta from '@/pages/support/components/SupportContactCta';
import type { Device } from '@/hooks/useDevice';
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

type SupportTab = 'FAQ' | 'CHAT';

function SupportPage() {
  const device = useDevice();
  const [activeTab, setActiveTab] = useState<SupportTab>('FAQ');
  const [activeCategory, setActiveCategory] = useState<FaqCategoryType | 'ALL'>(
    'ALL',
  );
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const { data: faqs } = useQuery(
    queries.faqs({
      faqCategory: activeCategory === 'ALL' ? undefined : activeCategory,
    }),
  );

  const handleToggleFaq = (faqId: number) => {
    setOpenFaqId((prev) => (prev === faqId ? null : faqId));
  };

  const handleContactClick = () => {
    setActiveTab('CHAT');
    showMessenger();
  };

  return (
    <>
      {device === 'pc' ? <PCHeader activeNav={null} /> : <MobileMainHeader />}
      <Main device={device}>
        <Title>고객센터</Title>

        <TabWrapper>
          <TabButton
            type="button"
            isActive={activeTab === 'FAQ'}
            onClick={() => setActiveTab('FAQ')}
          >
            FAQ
          </TabButton>
          <TabButton
            type="button"
            isActive={activeTab === 'CHAT'}
            onClick={handleContactClick}
          >
            1:1 문의하기
          </TabButton>
        </TabWrapper>

        {activeTab === 'FAQ' && (
          <ContentWrapper>
            <FaqCategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <FaqListWrapper>
              {faqs?.content?.map((faq) => {
                const isOpen = openFaqId === faq.faqId;

                return (
                  <Accordion key={faq.faqId}>
                    <Accordion.Header
                      isOpen={isOpen}
                      onToggle={() => handleToggleFaq(faq.faqId)}
                    >
                      <QuestionText>{faq.question}</QuestionText>
                    </Accordion.Header>

                    <Accordion.Content isOpen={isOpen}>
                      <AnswerText>{faq.answer}</AnswerText>
                    </Accordion.Content>
                  </Accordion>
                );
              })}
            </FaqListWrapper>

            <SupportContactCta onContactClick={handleContactClick} />
          </ContentWrapper>
        )}

        {activeTab === 'CHAT' && (
          <ChatGuideBox>채널톡 상담원과 연결됩니다.</ChatGuideBox>
        )}
      </Main>
    </>
  );
}

const Main = styled.main<{ device: Device }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ device, theme }) => {
    if (device === 'mobile') {
      return `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 24px) 16px 24px`;
    }

    if (device === 'tablet') {
      return `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 24px) 16px 24px`;
    }

    return `calc(${theme.heights.headerPC} + 40px + 24px) 16px 24px`;
  }};

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const TabWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: 8px;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 12px 16px;
  border-bottom: 2px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.primaryBomBom : 'transparent'};

  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.textPrimary : theme.colors.textSecondary};
  font: ${({ isActive, theme }) =>
    isActive ? theme.fonts.t6Bold : theme.fonts.t6Regular};
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const FaqListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuestionText = styled.span`
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const AnswerText = styled.p`
  width: 100%;
`;

const ChatGuideBox = styled.div`
  padding: 24px 16px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
