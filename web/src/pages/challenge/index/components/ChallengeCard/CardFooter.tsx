import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import type { PropsWithChildren } from 'react';

interface CardFooterProps {
  isEliminated: boolean;
}

const CardFooter = ({
  isEliminated,
  children,
}: PropsWithChildren<CardFooterProps>) => {
  return (
    <Footer>
      {children}

      {!isEliminated && (
        <DetailButton variant="transparent" isEliminated={isEliminated}>
          자세히 보기 →
        </DetailButton>
      )}
    </Footer>
  );
};

export default CardFooter;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailButton = styled(Button)<{ isEliminated: boolean }>`
  color: ${({ theme, isEliminated }) =>
    isEliminated ? theme.colors.disabledText : theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;
