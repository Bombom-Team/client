import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import type { Ref } from 'react';

interface DuplicateRequestSheetProps {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
  name: string;
  supporterCount: number;
  isPending: boolean;
  onSupport: () => void;
}

const DuplicateRequestSheet = ({
  modalRef,
  isOpen,
  closeModal,
  name,
  supporterCount,
  isPending,
  onSupport,
}: DuplicateRequestSheetProps) => {
  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position="bottom"
      showCloseButton={false}
    >
      <Container>
        <HeadWrapper>
          <Title>이미 {supporterCount}명이 신청한 뉴스레터예요</Title>
          <Description>
            공감을 누르면 같은 신청으로 합쳐지고, 등록되면 함께 알려드려요.
          </Description>
        </HeadWrapper>
        <FoundBox>{name}</FoundBox>
        <ButtonWrapper>
          <PrimaryButton onClick={onSupport} disabled={isPending}>
            나도 원해요
          </PrimaryButton>
          <TextButton variant="transparent" onClick={closeModal}>
            다른 뉴스레터 신청하기
          </TextButton>
        </ButtonWrapper>
      </Container>
    </Modal>
  );
};

export default DuplicateRequestSheet;

const Container = styled.div`
  width: 100%;
  padding: 8px 4px 4px;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const HeadWrapper = styled.div`
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
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const FoundBox = styled.div`
  padding: 16px;
  border-radius: 16px;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const PrimaryButton = styled(Button)`
  width: 100%;
  height: 52px;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const TextButton = styled(Button)`
  width: 100%;
  height: 44px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
