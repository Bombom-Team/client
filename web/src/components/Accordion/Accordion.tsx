import styled from '@emotion/styled';
import ChevronIcon from '../icons/ChevronIcon';
import type { ReactNode } from 'react';

interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const Accordion = ({ children }: AccordionProps) => {
  return <Container>{children}</Container>;
};

const Header = ({
  children,
  isOpen,
  onToggle,
}: {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <HeaderWrapper onClick={onToggle}>
      {children}
      <ChevronIcon direction={isOpen ? 'down' : 'up'} width={20} />
    </HeaderWrapper>
  );
};

const Content = ({
  children,
  isOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
}) => {
  return <ContentWrapper isOpen={isOpen}>{children}</ContentWrapper>;
};

Accordion.Header = Header;
Accordion.Content = Content;

export default Accordion;

const Container = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
`;

const HeaderWrapper = styled.div`
  padding: 10px;

  display: flex;
  justify-content: space-between;

  cursor: pointer;
`;

const ContentWrapper = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  padding: ${({ isOpen }) => (isOpen ? '8px 10px' : '0')};

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  line-height: 2;
`;
