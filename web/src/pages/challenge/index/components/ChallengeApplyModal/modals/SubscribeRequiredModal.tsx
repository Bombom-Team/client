import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { ModalDescription, ModalTitle } from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';
import type { Challenge } from '@/apis/challenge/challenge.api';
import ArrowRightIcon from '#/assets/svg/arrow-right.svg';

interface SubscribeRequiredModalProps {
  closeModal: () => void;
  newsletters: Challenge['newsletters'];
}

const SubscribeRequiredModal = ({
  closeModal,
  newsletters,
}: SubscribeRequiredModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const navigate = useNavigate();

  const handleNewsletterClick = (newsletterId: number) => {
    navigate({ to: `/?newsletterDetail=${newsletterId}` });
    closeModal();
  };

  return (
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
            <NewsletterImage src={newsletter.imageUrl} alt={newsletter.name} />
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
  );
};

export default SubscribeRequiredModal;

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
