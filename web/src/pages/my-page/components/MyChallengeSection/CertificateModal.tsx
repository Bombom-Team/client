import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import Certificate from '@/pages/challenge/certification/components/Certificate';
import type { Ref } from 'react';

interface CertificateModalProps {
  challengeId: number;
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
}

const CertificateModal = ({
  challengeId,
  modalRef,
  isOpen,
  closeModal,
}: CertificateModalProps) => {
  const { data: certificationInfo, isLoading } = useQuery({
    ...queries.certificationInfo(challengeId),
    enabled: isOpen,
  });

  return createPortal(
    <Modal modalRef={modalRef} closeModal={closeModal} isOpen={isOpen}>
      <Content>
        {isLoading && <LoadingText>수료증을 불러오는 중...</LoadingText>}
        {certificationInfo && <Certificate {...certificationInfo} />}
      </Content>
    </Modal>,
    document.body,
  );
};

export default CertificateModal;

const Content = styled.div`
  padding: 8px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.p`
  margin: 0;
  padding: 40px 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
