import styled from '@emotion/styled';
import type { PropsWithChildren } from 'react';

const CardHeader = ({ children }: PropsWithChildren) => {
  return <Header>{children}</Header>;
};

export default CardHeader;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;
