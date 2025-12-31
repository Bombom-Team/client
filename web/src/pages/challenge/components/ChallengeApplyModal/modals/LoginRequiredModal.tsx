import { useNavigate } from '@tanstack/react-router';
import {
  Container,
  ModalButton,
  ModalButtonGroup,
  ModalDescription,
  ModalTitle,
} from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

interface LoginRequiredModalProps {
  closeModal: () => void;
}

const LoginRequiredModal = ({ closeModal }: LoginRequiredModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate({ to: '/login' });
    closeModal();
  };

  return (
    <Container isMobile={isMobile}>
      <ModalTitle isMobile={isMobile}>로그인 후 신청할 수 있어요</ModalTitle>

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
  );
};

export default LoginRequiredModal;
