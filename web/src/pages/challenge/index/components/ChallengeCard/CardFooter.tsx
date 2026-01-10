import styled from '@emotion/styled';
import { type PropsWithChildren } from 'react';

const CardFooter = ({ children }: PropsWithChildren) => {
  return <Footer>{children}</Footer>;
};

export default CardFooter;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > :only-child {
    margin-left: auto;
  }
`;
