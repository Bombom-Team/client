import { Button, Modal } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import type { Ref } from 'react';

// 내가 낸 신청이나 이미 공감한 신청에는 공감을 다시 보내지 않고 내 신청으로 안내한다.
export type DuplicateRelation = 'none' | 'liked' | 'mine';

interface DuplicateRequestSheetProps {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
  name: string;
  requestCount: number;
  relation: DuplicateRelation;
  isPending: boolean;
  onLike: () => void;
  onViewMine: () => void;
}

const SHEET_TEXTS: Record<
  Exclude<DuplicateRelation, 'none'>,
  { title: string; description: string }
> = {
  mine: {
    title: '내가 신청한 뉴스레터예요',
    description: '진행 상황은 내 신청에서 확인할 수 있어요.',
  },
  liked: {
    title: '이미 공감한 뉴스레터예요',
    description: '등록되면 함께 알려드려요.',
  },
};

const DuplicateRequestSheet = ({
  modalRef,
  isOpen,
  closeModal,
  name,
  requestCount,
  relation,
  isPending,
  onLike,
  onViewMine,
}: DuplicateRequestSheetProps) => {
  const isAlreadyMine = relation !== 'none';

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
          <Title>
            {isAlreadyMine
              ? SHEET_TEXTS[relation].title
              : `이미 ${requestCount}명이 신청한 뉴스레터예요`}
          </Title>
          <Description>
            {isAlreadyMine
              ? SHEET_TEXTS[relation].description
              : '공감을 누르면 같은 신청으로 합쳐지고, 등록되면 함께 알려드려요.'}
          </Description>
        </HeadWrapper>
        <FoundBox>{name}</FoundBox>
        <ButtonWrapper>
          {isAlreadyMine ? (
            <PrimaryButton onClick={onViewMine}>내 신청 보기</PrimaryButton>
          ) : (
            <PrimaryButton onClick={onLike} disabled={isPending}>
              나도 원해요
            </PrimaryButton>
          )}
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
