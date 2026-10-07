import { Text } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';

interface InquiryMessageDeleteModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
  onDelete: () => void;
}

const InquiryMessageDeleteModal = ({
  modalRef,
  isOpen,
  closeModal,
  onDelete,
}: InquiryMessageDeleteModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleDeleteClick = () => {
    onDelete();
    closeModal();
  };

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      showCloseButton={false}
    >
      <Container isMobile={isMobile}>
        <ModalTitle>메시지를 삭제할까요?</ModalTitle>
        <Text font={isMobile ? 't4Regular' : 't6Regular'} color="textSecondary">
          삭제된 메시지는 복구할 수 없습니다.
        </Text>

        <ModalButtonGroup>
          <ModalButton isMobile={isMobile} onClick={handleDeleteClick}>
            삭제
          </ModalButton>
          <ModalButton
            isMobile={isMobile}
            onClick={closeModal}
            variant="outlined"
          >
            취소
          </ModalButton>
        </ModalButtonGroup>
      </Container>
    </Modal>
  );
};

export default InquiryMessageDeleteModal;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '80px' : '160px')};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
