import styled from '@emotion/styled';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';

const EventLoadingModal = () => {
  const device = useDevice();

  return (
    <Container>
      <ContentWrapper>
        <Text
          font={device === 'mobile' ? 'heading5' : 'heading4'}
          color="textPrimary"
        >
          접속 중입니다
        </Text>
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
