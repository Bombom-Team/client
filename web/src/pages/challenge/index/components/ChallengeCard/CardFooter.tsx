import styled from '@emotion/styled';
import { Children, type PropsWithChildren } from 'react';

const CardFooter = ({ children }: PropsWithChildren) => {
  const hasMultipleChildren = Children.count(children) > 1;

  return <Footer hasMultipleChildren={hasMultipleChildren}>{children}</Footer>;
};

export default CardFooter;

const Footer = styled.div<{ hasMultipleChildren: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ hasMultipleChildren }) =>
    hasMultipleChildren ? 'space-between' : 'flex-end'};
`;
