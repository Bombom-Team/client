import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import { useChallengeGuideModal } from '@/pages/challenge/index/hooks/useChallengeGuideModal';

interface ChallengeGuideModalProps {
  challengeId: number;
}

const ChallengeGuideModal = ({ challengeId }: ChallengeGuideModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const {
    modalRef,
    isOpen,
    closeModal,
    isAgreed,
    handleConfirm,
    handleGoToIntro,
    handleToggleAgreement,
  } = useChallengeGuideModal({ challengeId });

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position={isMobile ? 'bottom' : 'center'}
      showCloseButton={false}
    >
      <Container>
        <Header>
          <Title>시작 전 확인해주세요!</Title>
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
          <AgreementSection>
            <CheckboxWrapper>
              <Checkbox
                id="challenge-agreement"
                checked={isAgreed}
                onChange={handleToggleAgreement}
              />
              <AgreementLabel htmlFor="challenge-agreement" isMobile={isMobile}>
                위 내용을 모두 확인했고, 참여 기준에 동의합니다
              </AgreementLabel>
            </CheckboxWrapper>
          </AgreementSection>
          <StartButton
            variant="filled"
            onClick={handleConfirm}
            disabled={!isAgreed}
          >
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

const AgreementSection = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const AgreementLabel = styled.label<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};

  cursor: pointer;
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
