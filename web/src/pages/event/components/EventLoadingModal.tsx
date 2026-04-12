import styled from '@emotion/styled';
import Button from '@/components/Button/Button';

interface EventLoadingModalProps {
  closeModal: () => void;
}

const EventLoadingModal = ({ closeModal }: EventLoadingModalProps) => {
  return (
    <Container>
      <ContentWrapper>
        <Title>접속 중</Title>

        <Description>잠시만 기다려주세요.</Description>
        <ConfirmButton onClick={closeModal}>닫기</ConfirmButton>
      </ContentWrapper>
    </Container>
  );
};

export default EventLoadingModal;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-width: 264px;
  padding: 0 8px;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 400;
  text-align: center;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  max-width: 200px;

  font: ${({ theme }) => theme.fonts.body1};
`;
