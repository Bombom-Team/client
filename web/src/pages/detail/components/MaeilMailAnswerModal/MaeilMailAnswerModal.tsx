import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';

interface MaeilMailAnswerModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  onClose: () => void;
  articleId: number;
}

const MaeilMailAnswerModal = ({
  modalRef,
  isOpen,
  onClose,
  articleId,
}: MaeilMailAnswerModalProps) => {
  useQuery({
    ...queries.contentByArticleId({ articleId }),
    enabled: isOpen,
  });

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
