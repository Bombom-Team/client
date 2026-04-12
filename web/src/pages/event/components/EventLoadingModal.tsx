import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

interface EventLoadingModalProps {
  closeModal: () => void;
}

const EventLoadingModal = ({ closeModal }: EventLoadingModalProps) => {
  const device = useDevice();

  return (
    <Container>
      <ContentWrapper>
        <Title device={device}>접속 중</Title>

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
  gap: 0.75rem;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-width: 264px;
  padding: 0 0.5rem;

  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
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
