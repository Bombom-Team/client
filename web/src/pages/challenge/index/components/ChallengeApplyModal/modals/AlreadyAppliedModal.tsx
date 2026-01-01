import {
  Container,
  ModalButton,
  ModalButtonGroup,
  ModalDescription,
  ModalTitle,
} from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

interface AlreadyAppliedModalProps {
  closeModal: () => void;
}

const AlreadyAppliedModal = ({ closeModal }: AlreadyAppliedModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <ModalTitle isMobile={isMobile}>이미 신청한 챌린지예요</ModalTitle>

      <ModalDescription isMobile={isMobile}>
        이미 이 챌린지에 신청하셨어요.
      </ModalDescription>

      <ModalButtonGroup>
        <ModalButton isMobile={isMobile} onClick={closeModal}>
          확인
        </ModalButton>
      </ModalButtonGroup>
    </Container>
  );
};

export default AlreadyAppliedModal;
