import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import type { ChallengeEligibilityResponse } from '@/apis/challenge/challenge.api';

interface ChallengeApplyModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
  eligibility: ChallengeEligibilityResponse | null;
  isLoading: boolean;
  onApply: () => void;
}

const ChallengeApplyModal = ({
  modalRef,
  isOpen,
  closeModal,
  eligibility,
  isLoading,
  onApply,
}: ChallengeApplyModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const navigate = useNavigate();

  if (!eligibility || isLoading) {
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={true}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>로딩 중...</ModalTitle>
        </Container>
      </Modal>
    );
  }

  const { canApply, reasons } = eligibility;

  const handleLoginClick = () => {
    navigate({ to: '/login' });
    closeModal();
  };

  const handleSubscribeClick = () => {
    // navigate({ to: '/recommend' });
    closeModal();
  };

  const handleApplyClick = () => {
    onApply();
    closeModal();
  };

  if (canApply) {
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>챌린지에 참여할까요?</ModalTitle>
          <ModalDescription isMobile={isMobile}>
            신청을 완료하면 챌린지에 참여할 수 있어요.
          </ModalDescription>
          <ModalButtonGroup>
            <ModalButton isMobile={isMobile} onClick={handleApplyClick}>
              신청하고 참여하기
            </ModalButton>
            <ModalButton
              isMobile={isMobile}
              variant="outlined"
              onClick={closeModal}
            >
              나중에 할게요
            </ModalButton>
          </ModalButtonGroup>
        </Container>
      </Modal>
    );
  }

  const hasLoginIssue = reasons.includes('NOT_LOGGED_IN');

  if (hasLoginIssue)
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>
            로그인 후 신청할 수 있어요
          </ModalTitle>

          <ModalDescription isMobile={isMobile}>
            이 기능은 로그인한 사용자만 사용할 수 있어요.
          </ModalDescription>

          <ModalButtonGroup>
            <ModalButton isMobile={isMobile} onClick={handleLoginClick}>
              로그인하고 계속하기
            </ModalButton>
            <ModalButton
              variant="outlined"
              isMobile={isMobile}
              onClick={closeModal}
            >
              나중에 할게요
            </ModalButton>
          </ModalButtonGroup>
        </Container>
      </Modal>
    );

  const hasSubscribeIssue = reasons.includes('NOT_SUBSCRIBED');

  if (hasSubscribeIssue)
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>구독 후 이용할 수 있어요</ModalTitle>

          <ModalDescription isMobile={isMobile}>
            아래 뉴스레터를 구독하면 챌린지 참여가 가능해요.
          </ModalDescription>

          <ModalButtonGroup>
            <ModalButton isMobile={isMobile} onClick={handleSubscribeClick}>
              뉴스레터 구독하러 가기
            </ModalButton>
          </ModalButtonGroup>
        </Container>
      </Modal>
    );
};

export default ChallengeApplyModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '320px' : '440px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const ModalTitle = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const ModalDescription = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  white-space: pre-wrap;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '120px' : '160px')};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
