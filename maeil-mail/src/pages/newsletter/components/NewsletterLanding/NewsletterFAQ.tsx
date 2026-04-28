import styled from '@emotion/styled';
import { useState } from 'react';
import { Text } from '@bombom/shared/ui-web';
import Accordion from '@/components/Accordion/Accordion';
import { useDevice } from '@bombom/shared/ui-web';

const FAQ_ITEMS = [
  {
    id: 'delivery',
    question: '제 개인 이메일로 매일메일이 오나요?',
    answer:
      '아니요. 매일메일은 봄봄 서비스 안에서만 제공돼요. 봄봄에서 구독하고, 봄봄에서 읽는 방식이에요.',
  },
  {
    id: 'source',
    question: '매일메일 콘텐츠는 누가 제공하나요?',
    answer:
      '매일메일 팀의 콘텐츠를 바탕으로 제공돼요. 추후 봄봄에서도 더 편하게 읽고 활용하실 수 있도록 계속 개선해갈 예정이에요.',
  },
  {
    id: 'platform',
    question: '왜 다른 이메일 주소로는 제공하지 않나요?',
    answer:
      '장기적으로 무료로 서비스를 제공하기 위해, 현재는 봄봄 안에서만 콘텐츠를 제공하고 있어요.',
  },
  {
    id: 'free',
    question: '매일메일은 무료인가요?',
    answer: '네. 봄봄에서 제공되는 매일메일은 무료로 이용하실 수 있어요.',
  },
  {
    id: 'unsubscribe',
    question: '구독을 해지할 수 있나요?',
    answer:
      '구독 해지는 추후 지원할 예정이에요. 그전까지는 채널톡으로 문의해 주세요.',
  },
  {
    id: 'support',
    question: '구독했는데 콘텐츠가 안 보이거나 문제가 있어요.',
    answer:
      '이용 중 문제가 있으면 채널톡으로 문의해 주세요. 확인 후 빠르게 도와드릴게요.',
  },
] as const;

const NewsletterFAQ = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const handleToggle = (questionId: string) => {
    setOpenQuestionId((prev) => (prev === questionId ? null : questionId));
  };

  return (
    <Container isMobile={isMobile}>
      <HeaderWrapper>
        <Text as="h3" color="textPrimary" font="t10Bold">
          자주 묻는 질문
        </Text>
        <Text as="p" color="textSecondary" font="t5Regular">
          구독 전에 많이 궁금해하시는 내용을 모아두었어요.
        </Text>
      </HeaderWrapper>

      <AccordionList>
        {FAQ_ITEMS.map(({ id, question, answer }) => {
          const isOpen = openQuestionId === id;

          return (
            <Accordion key={id}>
              <Accordion.Header
                isOpen={isOpen}
                onToggle={() => handleToggle(id)}
              >
                <QuestionWrapper>
                  <Text color="primary" font="t6Bold">
                    Q.
                  </Text>
                  <Text color="textPrimary" font="t6Bold">
                    {question}
                  </Text>
                </QuestionWrapper>
              </Accordion.Header>

              <Accordion.Content isOpen={isOpen}>
                <Answer>{answer}</Answer>
              </Accordion.Content>
            </Accordion>
          );
        })}
      </AccordionList>
    </Container>
  );
};

export default NewsletterFAQ;

const Container = styled.aside<{ isMobile: boolean }>`
  margin: 0 ${({ isMobile }) => (isMobile ? '24px' : '40px')};

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const AccordionList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;

  & > div {
    overflow: hidden;
    border: 1px solid rgb(0 0 0 / 7%);
    border-radius: 16px;

    background: rgb(255 255 255 / 70%);
  }

  & > div > div:first-of-type {
    padding: 18px 16px;
    border-bottom: none;

    align-items: flex-start;
  }

  & > div > div:last-of-type {
    padding: 0 16px 18px;
    background-color: transparent;
  }
`;

const QuestionWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const Answer = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
