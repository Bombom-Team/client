import { ChevronIcon } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import type { PropsWithChildren, ReactNode } from 'react';

interface FunnelLayoutProps extends PropsWithChildren {
  step: number;
  totalStep: number;
  onBack: () => void;
  footer: ReactNode;
}

// 토스식 퍼널: 한 화면에 질문 하나, 주 버튼은 항상 화면 아래 같은 자리에 둔다.
const FunnelLayout = ({
  step,
  totalStep,
  onBack,
  footer,
  children,
}: FunnelLayoutProps) => {
  return (
    <Container>
      <HeaderWrapper>
        <BackButton type="button" aria-label="뒤로 가기" onClick={onBack}>
          <ChevronIcon direction="left" width={24} height={24} />
        </BackButton>
        <StepCount>
          {step}/{totalStep}
        </StepCount>
      </HeaderWrapper>
      <ProgressBar rate={(step / totalStep) * 100} />
      <ContentWrapper>{children}</ContentWrapper>
      <FooterWrapper>{footer}</FooterWrapper>
    </Container>
  );
};

export default FunnelLayout;

const Container = styled.div`
  width: 100%;
  min-height: calc(100dvh - 120px);
  max-width: 560px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const StepCount = styled.span`
  padding-right: 8px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  font-variant-numeric: tabular-nums;
`;

const ContentWrapper = styled.div`
  padding: 28px 4px 24px;

  display: flex;
  gap: 24px;
  flex: 1;
  flex-direction: column;
`;

const FooterWrapper = styled.div`
  position: sticky;
  bottom: 0;
  padding: 12px 0 calc(20px + ${({ theme }) => theme.safeArea.bottom});

  display: flex;
  gap: 8px;
  flex-direction: column;

  background: linear-gradient(
    to bottom,
    rgb(255 255 255 / 0%),
    ${({ theme }) => theme.colors.white} 24%
  );
`;
