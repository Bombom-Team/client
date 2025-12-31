import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import type {
  ChallengeEligibilityResponse,
  ChallengeNewsletter,
} from '@/apis/challenge/challenge.api';
import ArrowRightIcon from '#/assets/svg/arrow-right.svg';

interface ChallengeApplyModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
  eligibility: ChallengeEligibilityResponse | null;
  isLoading: boolean;
  onApply: () => void;
  newsletters: ChallengeNewsletter[];
}

const ChallengeApplyModal = ({
  modalRef,
  isOpen,
  closeModal,
  eligibility,
  isLoading,
  onApply,
  newsletters,
}: ChallengeApplyModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const navigate = useNavigate();

  if (!eligibility || isLoading) {
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={true}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>로딩 중...</ModalTitle>
        </Container>
      </Modal>
    );
  }

  const { canApply, reasons } = eligibility;

  const handleLoginClick = () => {
    navigate({ to: '/login' });
    closeModal();
  };

  const handleNewsletterClick = (newsletterId: number) => {
    navigate({ to: `/?newsletterDetail=${newsletterId}` });
    closeModal();
  };

  const handleApplyClick = () => {
    onApply();
    closeModal();
  };

  if (canApply) {
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>챌린지에 참여할까요?</ModalTitle>
          <ModalDescription isMobile={isMobile}>
            신청을 완료하면 챌린지에 참여할 수 있어요.
          </ModalDescription>
          <ModalButtonGroup>
            <ModalButton isMobile={isMobile} onClick={handleApplyClick}>
              신청하고 참여하기
            </ModalButton>
            <ModalButton
              isMobile={isMobile}
              variant="outlined"
              onClick={closeModal}
            >
              나중에 할게요
            </ModalButton>
          </ModalButtonGroup>
        </Container>
      </Modal>
    );
  }

  const hasLoginIssue = reasons.includes('NOT_LOGGED_IN');

  if (hasLoginIssue)
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Container isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>
            로그인 후 신청할 수 있어요
          </ModalTitle>

          <ModalDescription isMobile={isMobile}>
            이 기능은 로그인한 사용자만 사용할 수 있어요.
          </ModalDescription>

          <ModalButtonGroup>
            <ModalButton isMobile={isMobile} onClick={handleLoginClick}>
              로그인하고 계속하기
            </ModalButton>
            <ModalButton
              variant="outlined"
              isMobile={isMobile}
              onClick={closeModal}
            >
              나중에 할게요
            </ModalButton>
          </ModalButtonGroup>
        </Container>
      </Modal>
    );

  const hasSubscribeIssue = reasons.includes('NOT_SUBSCRIBED');

  if (hasSubscribeIssue)
    return (
      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <SubscribeContainer isMobile={isMobile}>
          <ModalTitle isMobile={isMobile}>구독 후 이용할 수 있어요</ModalTitle>

          <ModalDescription isMobile={isMobile}>
            아래 뉴스레터를 구독하면 챌린지 참여가 가능해요.
          </ModalDescription>

          <NewsletterList>
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                onClick={() => handleNewsletterClick(newsletter.id)}
              >
                <NewsletterImage
                  src={newsletter.imageUrl}
                  alt={newsletter.name}
                />
                <NewsletterInfo>
                  <NewsletterName>{newsletter.name}</NewsletterName>
                </NewsletterInfo>
                <SubscribeAction>
                  <SubscribeText>구독하러 가기</SubscribeText>
                  <ArrowRightIcon width={20} height={20} />
                </SubscribeAction>
              </NewsletterCard>
            ))}
          </NewsletterList>
        </SubscribeContainer>
      </Modal>
    );
};

export default ChallengeApplyModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '320px' : '440px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const ModalTitle = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const ModalDescription = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  white-space: pre-wrap;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ModalButton = styled(Button)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '120px' : '160px')};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const SubscribeContainer = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '320px' : '480px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const NewsletterList = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const NewsletterCard = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 25px -8px rgb(0 0 0 / 12%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const NewsletterImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);

  flex-shrink: 0;

  object-fit: cover;
`;

const NewsletterInfo = styled.div`
  min-height: 64px;

  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  text-align: left;
`;

const NewsletterName = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const SubscribeAction = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary};
`;

const SubscribeText = styled.span`
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;
