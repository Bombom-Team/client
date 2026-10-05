import styled from '@emotion/styled';

const UnreadDot = () => <Container />;

export default UnreadDot;

const Container = styled.span`
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.error};
`;
