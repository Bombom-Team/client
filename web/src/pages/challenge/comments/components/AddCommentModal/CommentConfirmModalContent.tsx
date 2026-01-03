import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

interface CommentConfirmModalContentProps {
  closeModal: () => void;
  onConfirm: () => void;
}

const CommentConfirmModalContent = ({
  closeModal,
  onConfirm,
}: CommentConfirmModalContentProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleConfirmComment = () => {
    onConfirm();
    closeModal();
  };

  return (
    <Container isMobile={isMobile}>
      <Title isMobile={isMobile}>코멘트를 등록할까요?</Title>

      <Description isMobile={isMobile}>등록되면 수정할 수 없어요.</Description>

      <ButtonWrapper>
        <ModalButton onClick={handleConfirmComment} isMobile={isMobile}>
          등록
        </ModalButton>
        <ModalButton
          variant="outlined"
          onClick={closeModal}
          isMobile={isMobile}
        >
          취소
        </ModalButton>
      </ButtonWrapper>
    </Container>
  );
};

export default CommentConfirmModalContent;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const Description = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '80px' : '160px')};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
