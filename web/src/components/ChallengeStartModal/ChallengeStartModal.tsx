import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Modal from '@/components/Modal/Modal';
import { useChallengeStartModal } from '@/hooks/useChallengeStartModal';
import { useDevice } from '@/hooks/useDevice';

const ChallengeStartModal = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const {
    modalRef,
    isOpen,
    challenge,
    dayIndex,
    isDontShowChecked,
    handleStart,
    handleClose,
    handleToggleDontShow,
  } = useChallengeStartModal();

  if (!challenge) return null;

  const isFirstDay = dayIndex === 1;

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={handleClose}
      position={isMobile ? 'bottom' : 'center'}
    >
      <Container>
        <Header>
          <Emoji aria-hidden>🌱</Emoji>
          <ChallengeName>
            {challenge.title} {challenge.generation}기
          </ChallengeName>
          <Title>
            {isFirstDay
              ? '오늘부터 챌린지가 시작돼요!'
              : '챌린지가 시작됐어요!'}
          </Title>
          <Description>
            {isFirstDay
              ? '첫날 활동으로 챌린지를 시작해보세요.'
              : `벌써 ${dayIndex}일차예요. 지금 첫 활동을 시작해보세요.`}
          </Description>
        </Header>

        <ButtonWrapper>
          <StartButton variant="filled" onClick={handleStart}>
            챌린지 시작하기
          </StartButton>
          <Checkbox
            id="challenge-start-modal-dont-show"
            checked={isDontShowChecked}
            onChange={handleToggleDontShow}
          >
            <CheckboxLabel>다시 보지 않기</CheckboxLabel>
          </Checkbox>
        </ButtonWrapper>
      </Container>
    </Modal>
  );
};

export default ChallengeStartModal;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 24px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
`;

const Emoji = styled.span`
  font-size: 2.5rem;
`;

const ChallengeName = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t6Bold};
  text-align: center;

  word-break: keep-all;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;

  word-break: keep-all;
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;

  word-break: keep-all;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
`;

const StartButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const CheckboxLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
