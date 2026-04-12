import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

const MODAL_CONTENT = {
  UNSUBSCRIBE: {
    title: '구독을 취소하시겠습니까?',
    description:
      '구독을 취소하면 해당 뉴스레터의\n새로운 소식을 받아볼 수 없습니다.',
    confirmButtonText: '네, 취소할래요',
  },
  REMOVE: {
    title: '구독 취소를 완료하셨나요?',
    description:
      '취소하지 않고 목록에서 제거하면\n뉴스레터가 계속 올 수 있어요.',
    confirmButtonText: '네, 취소했어요',
  },
};

interface NewsletterUnsubscribeModalProps {
  onClose: () => void;
  onUnsubscribe: () => void;
  type: 'UNSUBSCRIBE' | 'REMOVE';
}

const NewsletterUnsubscribeModal = ({
  onClose,
  onUnsubscribe,
  type,
}: NewsletterUnsubscribeModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <Title isMobile={isMobile}>{MODAL_CONTENT[type].title}</Title>

      <UnsubscribeDescription isMobile={isMobile}>
        {MODAL_CONTENT[type].description}
      </UnsubscribeDescription>

      <ModalButtonWrapper>
        <ModalButton
          isMobile={isMobile}
          variant="outlined"
          onClick={() => {
            onUnsubscribe();
            onClose();
          }}
        >
          {MODAL_CONTENT[type].confirmButtonText}
        </ModalButton>
        <ModalButton isMobile={isMobile} variant="outlined" onClick={onClose}>
          아니요, 유지할래요
        </ModalButton>
      </ModalButtonWrapper>
    </Container>
  );
};

export default NewsletterUnsubscribeModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-width: ${({ isMobile }) => (isMobile ? '280px' : '440px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const UnsubscribeDescription = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const ModalButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)<{ isMobile: boolean }>`
  height: 48px;
  min-width: ${({ isMobile }) => (isMobile ? '120px' : '160px')};
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.body2};

  word-break: keep-all;
`;
