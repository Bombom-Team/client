import {
  Container,
  ModalButton,
  ModalButtonGroup,
  ModalDescription,
  ModalTitle,
} from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

interface ErrorModalProps {
  closeModal: () => void;
}

const ErrorModal = ({ closeModal }: ErrorModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <ModalTitle>일시적인 오류가 발생했어요</ModalTitle>

      <ModalDescription>잠시 후 다시 시도해주세요.</ModalDescription>

      <ModalButtonGroup>
        <ModalButton isMobile={isMobile} onClick={closeModal}>
          확인
        </ModalButton>
      </ModalButtonGroup>
    </Container>
  );
};

export default ErrorModal;
