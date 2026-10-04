import styled from '@emotion/styled';

const STEPS = [
  { title: '신청 접수', description: '방금' },
  { title: '정보 자동 수집', description: '이름, 소개, 발행 주기, 썸네일' },
  { title: '운영진 확인', description: '보통 2~3일 걸려요' },
  { title: '봄봄에 등록', description: '구독하기 버튼이 열려요' },
];

const DoneTimeline = () => {
  return (
    <Container aria-label="진행 상황">
      {STEPS.map((step, index) => (
        <StepItem key={step.title}>
          <Dot isDone={index === 0} />
          <StepTextBox>
            <StepTitle isDone={index === 0}>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepTextBox>
        </StepItem>
      ))}
    </Container>
  );
};

export default DoneTimeline;

const Container = styled.ol`
  padding: 20px 20px 4px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;

  display: flex;
  flex-direction: column;
`;

const StepItem = styled.li`
  position: relative;
  padding-bottom: 16px;

  display: grid;
  gap: 12px;

  grid-template-columns: 20px 1fr;

  &:not(:last-of-type)::before {
    position: absolute;
    top: 20px;
    bottom: 0;
    left: 9px;
    width: 2px;

    background-color: ${({ theme }) => theme.colors.dividers};

    content: '';
  }
`;

const Dot = styled.span<{ isDone: boolean }>`
  position: relative;
  z-index: 1;
  width: 20px;
  height: 20px;
  border: 2px solid
    ${({ theme, isDone }) =>
      isDone ? theme.colors.primaryBomBom : theme.colors.stroke};
  border-radius: 50%;
  box-shadow: inset 0 0 0 3px ${({ theme }) => theme.colors.white};

  background-color: ${({ theme, isDone }) =>
    isDone ? theme.colors.primaryBomBom : theme.colors.white};
`;

const StepTextBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const StepTitle = styled.span<{ isDone: boolean }>`
  color: ${({ theme, isDone }) =>
    isDone ? theme.colors.textPrimary : theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const StepDescription = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;
