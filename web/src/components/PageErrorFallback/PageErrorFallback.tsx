import styled from '@emotion/styled';
import Button from '../Button/Button';
import Text from '../Text/Text';

const PageErrorFallback = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container role="alert">
      <Text as="h1" font="t11Bold" color="textPrimary">
        문제가 발생했어요
      </Text>
      <Text as="p" font="t6Regular" color="textSecondary">
        예상치 못한 오류가 발생했어요.
        <br />
        잠시 후 다시 시도해주세요.
      </Text>
      <Button onClick={handleRefresh}>새로고침</Button>
    </Container>
  );
};

export default PageErrorFallback;

const Container = styled.div`
  width: 100%;
  min-height: 100dvh;
  padding: 24px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;
