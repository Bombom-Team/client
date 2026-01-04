import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useChallengeGuideModal } from '@/pages/challenge/index/hooks/useChallengeGuideModal';

interface ChallengeGuideModalProps {
  challengeId: number;
}

const ChallengeGuideModal = ({ challengeId }: ChallengeGuideModalProps) => {
  const { modalRef, isOpen, handleConfirm, handleGoToIntro, handleCloseModal } =
    useChallengeGuideModal({ challengeId });

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={handleCloseModal}
      position="center"
      showCloseButton={true}
      showBackdrop={true}
    >
      <Container>
        <Header>
          <TrophyIcon>🏆</TrophyIcon>
          <Title>챌린지 시작 전 확인해주세요!</Title>
        </Header>

        <GuideList>
          <GuideItem>
            <GuideIcon>📊</GuideIcon>
            <GuideContent>
              <GuideTitle>참여율 기준</GuideTitle>
              <GuideDescription>
                80% 이상 참여하지 않으면 탈락 처리됩니다.
              </GuideDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideIcon>📰</GuideIcon>
            <GuideContent>
              <GuideTitle>뉴스레터 인증</GuideTitle>
              <GuideDescription>
                매일 발행 뉴스레터를 구독 중이더라도 특정일에만 발행되는
                뉴스레터를 읽어도 참여 인증에 인정됩니다.
              </GuideDescription>
            </GuideContent>
          </GuideItem>

          <GuideItem>
            <GuideIcon>✍️</GuideIcon>
            <GuideContent>
              <GuideTitle>데일리 가이드</GuideTitle>
              <GuideDescription>
                매일매일 가이드 혹은 질문에 대한 답변을 작성하여 독서 습관을
                기를 수 있습니다.
              </GuideDescription>
            </GuideContent>
          </GuideItem>
        </GuideList>

        <ButtonSection>
          <StartButton variant="filled" onClick={handleConfirm}>
            시작하기
          </StartButton>
          <IntroButton variant="outlined" onClick={handleGoToIntro}>
            자세한 소개 보기
          </IntroButton>
        </ButtonSection>
      </Container>
    </Modal>
  );
};

export default ChallengeGuideModal;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 24px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
`;

const TrophyIcon = styled.div`
  font-size: 48px;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;

const GuideList = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const GuideItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const GuideIcon = styled.div`
  flex-shrink: 0;

  font-size: 24px;
  line-height: 1.4;
`;

const GuideContent = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const GuideTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const GuideDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  line-height: 1.5;
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const StartButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;

  font: ${({ theme }) => theme.fonts.heading6};
`;

const IntroButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;

  font: ${({ theme }) => theme.fonts.body1};
`;
