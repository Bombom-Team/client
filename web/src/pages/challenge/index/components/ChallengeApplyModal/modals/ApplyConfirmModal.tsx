import {
  Container,
  ModalButton,
  ModalButtonGroup,
  ModalDescription,
  ModalTitle,
} from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

interface ApplyConfirmModalProps {
  closeModal: () => void;
  onApply: () => void;
}

const ApplyConfirmModal = ({ closeModal, onApply }: ApplyConfirmModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleApplyClick = () => {
    onApply();
    closeModal();
  };

  return (
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
  );
};

export default ApplyConfirmModal;
