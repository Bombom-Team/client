import { Modal, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import InquiryMessageInput from './InquiryMessageInput';
import type { SendInquiryMessageBody } from '@/apis/inquiry/inquiry.api';
import type { Ref } from 'react';

interface InquiryStartModalProps {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
  isSubmitting: boolean;
  onSubmit: (body: SendInquiryMessageBody) => Promise<unknown>;
}

const InquiryStartModal = ({
  modalRef,
  isOpen,
  closeModal,
  isSubmitting,
  onSubmit,
}: InquiryStartModalProps) => {
  const device = useDevice();
  const isMobile = device !== 'pc';

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={isMobile ? 'bottom' : 'center'}
    >
      <Container isMobile={isMobile}>
        <Header>
          <Title>새 문의</Title>
          <Description>
            궁금한 점이나 불편한 점을 남겨주세요. 평일 10:00-18:00 운영, 보통
            1영업일 안에 답변드려요.
          </Description>
        </Header>
        <InquiryMessageInput
          isExpanded
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </Container>
    </Modal>
  );
};

export default InquiryStartModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '560px')};
  max-width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Header = styled.div`
  padding: 8px 16px 0;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};

  word-break: keep-all;
`;
