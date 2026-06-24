import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { useDevice } from '../../../../../../shared/src/ui-web/hooks/useDevice';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Certificate from '@/pages/challenge/certification/components/Certificate';
import { useCertificateDownload } from '@/pages/challenge/certification/hooks/useCertificateDownload';
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

  const { certificateRef, download } = useCertificateDownload(
    certificationInfo?.nickname,
  );

  const device = useDevice();

  return createPortal(
    <Modal
      position={device === 'pc' ? 'center' : 'fullscreen'}
      modalRef={modalRef}
      closeModal={closeModal}
      isOpen={isOpen}
    >
      <Content>
        {isLoading && <LoadingText>수료증을 불러오는 중...</LoadingText>}
        {certificationInfo && (
          <>
            <DownloadButton onClick={download}>
              💾 이미지로 저장하기
            </DownloadButton>
            <CertificateWrapper ref={certificateRef}>
              <Certificate {...certificationInfo} />
            </CertificateWrapper>
          </>
        )}
      </Content>
    </Modal>,
    document.body,
  );
};

export default CertificateModal;

const Content = styled.div`
  padding: 8px 0;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

const CertificateWrapper = styled.div``;

const LoadingText = styled.p`
  margin: 0;
  padding: 40px 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;

const DownloadButton = styled(Button)`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t3Regular};
  font-weight: 600;
  white-space: nowrap;
`;
