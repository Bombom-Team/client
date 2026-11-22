import { Modal, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useState } from 'react';
import RecommendStep from './RecommendStep';
import SourceStep from './SourceStep';
import { useSignupSourceModal } from '@/hooks/useSignupSourceModal';

type Step = 'source' | 'recommend';

const SignupSourceModal = () => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { modalRef, isOpen, closeModal } = useSignupSourceModal();
  const [step, setStep] = useState<Step>('source');
  const stepNumber = step === 'source' ? 1 : 2;

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={isMobile ? 'bottom' : 'center'}
      showCloseButton={false}
    >
      <Container isMobile={isMobile}>
        <StepBar aria-label={`2단계 중 ${stepNumber}단계`}>
          <StepSegment isActive />
          <StepSegment isActive={step === 'recommend'} />
        </StepBar>
        {step === 'source' ? (
          <SourceStep onSaved={() => setStep('recommend')} />
        ) : (
          <RecommendStep onFinish={closeModal} />
        )}
      </Container>
    </Modal>
  );
};

export default SignupSourceModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '440px')};
  padding: ${({ isMobile, theme }) =>
    isMobile
      ? `24px 20px calc(20px + ${theme.safeArea.bottom})`
      : '28px 24px 24px'};

  display: flex;
  gap: 16px;
  flex-direction: column;

  box-sizing: border-box;
`;

const StepBar = styled.div`
  display: flex;
  gap: 4px;
`;

const StepSegment = styled.span<{ isActive?: boolean }>`
  height: 4px;
  border-radius: 2px;

  flex: 1;

  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primaryBomBom : theme.colors.disabledBackground};

  transition: background-color 0.3s ease;
`;
