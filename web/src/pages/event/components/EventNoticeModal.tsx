import styled from '@emotion/styled';
import Button from '@/components/Button/Button';

interface EventNoticeModalProps {
  closeModal: () => void;
}

const EventNoticeModal = ({ closeModal }: EventNoticeModalProps) => {
  return (
    <Container>
      <Title>이벤트 기간이 아닙니다.</Title>
      <Description>자세한 내용은 이벤트 페이지를 참고해주세요.</Description>
      <Button onClick={closeModal}>확인</Button>
    </Container>
  );
};

export default EventNoticeModal;

const Container = styled.div`
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
  font: ${({ theme }) => theme.fonts.body1};
  text-align: center;
`;
