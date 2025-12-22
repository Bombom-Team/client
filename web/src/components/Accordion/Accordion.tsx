import styled from '@emotion/styled';
import ChevronIcon from '../icons/ChevronIcon';
import type { PropsWithChildren } from 'react';

interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
}

type AccordionContentProps = Omit<AccordionProps, 'onToggle'>;

const Accordion = ({ children }: PropsWithChildren) => {
  return <Container>{children}</Container>;
};

const Header = ({
  children,
  isOpen,
  onToggle,
}: PropsWithChildren<AccordionProps>) => {
  return (
    <HeaderWrapper onClick={onToggle}>
      {children}
      <ChevronIcon direction={isOpen ? 'up' : 'down'} width={20} />
    </HeaderWrapper>
  );
};

const Content = ({
  children,
  isOpen,
}: PropsWithChildren<AccordionContentProps>) => {
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
  padding: ${({ isOpen }) => (isOpen ? '8px 10px' : '0')};

  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  line-height: 2;
`;
