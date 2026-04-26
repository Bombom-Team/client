import styled from '@emotion/styled';
import Modal from '@/components/Modal/Modal';

interface MaeilMailAnswerModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MaeilMailAnswerModal = ({
  modalRef,
  isOpen,
  onClose,
}: MaeilMailAnswerModalProps) => {
  return (
    <Modal modalRef={modalRef} isOpen={isOpen} closeModal={onClose}>
      <Container>
        <Title>답변 작성</Title>
      </Container>
    </Modal>
  );
};

export default MaeilMailAnswerModal;

const Container = styled.div`
  padding: 24px 0 0;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;
