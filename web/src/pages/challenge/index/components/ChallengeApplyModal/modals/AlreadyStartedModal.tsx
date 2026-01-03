import {
  Container,
  ModalButton,
  ModalButtonGroup,
  ModalDescription,
  ModalTitle,
} from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

interface AlreadyStartedModalProps {
  closeModal: () => void;
}

const AlreadyStartedModal = ({ closeModal }: AlreadyStartedModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <ModalTitle isMobile={isMobile}>이미 시작된 챌린지예요</ModalTitle>

      <ModalDescription isMobile={isMobile}>
        챌린지가 이미 시작되어 신청할 수 없어요.
      </ModalDescription>

      <ModalButtonGroup>
        <ModalButton isMobile={isMobile} onClick={closeModal}>
          확인
        </ModalButton>
      </ModalButtonGroup>
    </Container>
  );
};

export default AlreadyStartedModal;
