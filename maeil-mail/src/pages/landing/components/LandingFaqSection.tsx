import styled from '@emotion/styled';
import type { RefObject } from 'react';
import { FAQ_ITEMS } from '@/pages/landing/constants/landingContent';

type LandingFaqSectionProps = {
  openFaqId: string;
  onToggleFaq: (faqId: string) => void;
  visible: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

const LandingFaqSection = ({
  openFaqId,
  onToggleFaq,
  visible,
  sectionRef,
}: LandingFaqSectionProps) => {
  return (
    <Container id="faq" ref={sectionRef} $visible={visible}>
      <SectionKicker>FAQ</SectionKicker>
      <SectionTitle>자주 묻는 질문</SectionTitle>

      <FaqList>
        {FAQ_ITEMS.map(({ id, question, answer }) => {
          const isOpen = openFaqId === id;

          return (
            <FaqItem key={id}>
              <FaqButton onClick={() => onToggleFaq(id)}>
                <FaqQuestionRow>
                  <QuestionPrefix>Q.</QuestionPrefix>
                  <FaqQuestion>{question}</FaqQuestion>
                </FaqQuestionRow>
                <FaqToggle $isOpen={isOpen}>+</FaqToggle>
              </FaqButton>

              <FaqAnswerWrap $isOpen={isOpen}>
                <FaqAnswerInner>
                  <FaqAnswer>{answer}</FaqAnswer>
                </FaqAnswerInner>
              </FaqAnswerWrap>
            </FaqItem>
          );
        })}
      </FaqList>
    </Container>
  );
};

export default LandingFaqSection;

const Container = styled.section<{ $visible: boolean }>`
  max-width: 1140px;
  margin: 0 auto;
  padding: 80px 18px 120px;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width >= 920px) {
    padding: 100px 28px 150px;
  }
`;

const SectionKicker = styled.p`
  margin-bottom: 12px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  letter-spacing: 0.14em;

  opacity: 0.38;
`;

const SectionTitle = styled.h2`
  margin-bottom: 44px;

  font-weight: 800;
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  line-height: 1.03;
  letter-spacing: -0.03em;
`;

const FaqList = styled.div`
  margin-top: 32px;
  border-top: 1px solid rgb(0 0 0 / 10%);

  display: flex;
  flex-direction: column;
`;

const FaqItem = styled.article`
  border-bottom: 1px solid rgb(0 0 0 / 10%);
`;

const FaqButton = styled.button`
  width: 100%;
  padding: 22px 0;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  text-align: left;

  transition: opacity 180ms ease;

  &:hover {
    opacity: 0.72;
  }
`;

const FaqQuestionRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const QuestionPrefix = styled.span`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const FaqQuestion = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  line-height: 1.44;
`;

const FaqToggle = styled.span<{ $isOpen: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t9Regular};
  line-height: 1;

  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(45deg)' : 'rotate(0deg)')};
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const FaqAnswerWrap = styled.div<{ $isOpen: boolean }>`
  display: grid;

  grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
  transition: grid-template-rows 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const FaqAnswerInner = styled.div`
  overflow: hidden;
`;

const FaqAnswer = styled.p`
  padding: 0 0 20px 34px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.72;
`;
