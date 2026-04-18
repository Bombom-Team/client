import styled from '@emotion/styled';

const NewsletterFAQ = () => {
  return (
    <Container>
      <Question>Q. 제 개인 이메일로 매일메일이 오나요?</Question>
      <Answer>
        아니요. 매일메일은 <strong>봄봄 서비스 내에서만</strong> 제공돼요. 기존
        구독자분들도 사전 구독을 하시면 봄봄에서 만나보실 수 있어요.
      </Answer>
    </Container>
  );
};

export default NewsletterFAQ;

const Container = styled.aside`
  padding: 24px 28px;
  border: 1px solid rgb(0 0 0 / 7%);
  border-radius: 20px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(12px);
`;

const Question = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const Answer = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
