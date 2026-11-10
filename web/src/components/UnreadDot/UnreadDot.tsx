import styled from '@emotion/styled';
import type { ComponentProps } from 'react';

type UnreadDotProps = ComponentProps<'span'>;

const UnreadDot = (props: UnreadDotProps) => <Container {...props} />;

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
