import styled from '@emotion/styled';

const NewsletterSubscribeGuide = () => {
  return (
    <Container>
      <SubscribeHeader>
        <SubscribeTitle>구독 방법</SubscribeTitle>
      </SubscribeHeader>

      <SubscribeContent>
        <StepsWrapper>
          <StepItem>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>구독하기 버튼 클릭</StepTitle>
              <StepDescription>
                {'위의 "구독하기" 버튼을 눌러주세요.'}
              </StepDescription>
            </StepContent>
          </StepItem>
          <StepItem>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>구독 페이지 접속</StepTitle>
              <StepDescription>
                뉴스레터 공식 구독 페이지로 이동합니다.
              </StepDescription>
            </StepContent>
          </StepItem>
          <StepItem>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>봄봄 메일 붙여넣기</StepTitle>
              <StepDescription>
                이메일 칸에 봄봄 메일을 입력해주세요.
              </StepDescription>
              <StepDescription>
                봄봄을 통해 접속한 유저라면 즉시 붙여넣기가 가능합니다!
              </StepDescription>
            </StepContent>
          </StepItem>
          <StepItem>
            <StepNumber>4</StepNumber>
            <StepContent>
              <StepTitle>구독 완료!</StepTitle>
              <StepDescription>
                축하합니다! 이제 정기적으로 뉴스레터를 받아보세요.
              </StepDescription>
            </StepContent>
          </StepItem>
        </StepsWrapper>
      </SubscribeContent>
    </Container>
  );
};

export default NewsletterSubscribeGuide;

const Container = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.5rem;

  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const SubscribeHeader = styled.div`
  width: 100%;
  padding: 0.5rem 0;
`;

const SubscribeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const SubscribeContent = styled.div`
  width: 100%;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};
`;

const StepsWrapper = styled.div`
  position: relative;
  padding: 1.25rem 1rem;

  &::before {
    position: absolute;
    top: 2.25rem;
    bottom: 4.25rem;
    left: 2rem;
    width: 0.125rem;

    background: ${({ theme }) => theme.colors.dividers};

    content: '';
  }
`;

const StepItem = styled.div`
  position: relative;
  margin-bottom: 2rem;

  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepNumber = styled.span`
  z-index: ${({ theme }) => theme.zIndex.content};
  width: 2rem;
  height: 2rem;
  border: 0.125rem solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  box-shadow: 0 0.125rem 0.5rem rgb(0 0 0 / 10%);

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body2};
`;

const StepContent = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
`;

const StepTitle = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
