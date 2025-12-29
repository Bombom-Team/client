import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import type { MouseEventHandler, PropsWithChildren } from 'react';

interface CardFooterProps {
  onDetailClick?: MouseEventHandler<HTMLButtonElement>;
}

const CardFooter = ({
  onDetailClick,
  children,
}: PropsWithChildren<CardFooterProps>) => {
  const handleDetailClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    onDetailClick?.(event);
  };

  return (
    <Footer>
      {children}

      <DetailButton variant="transparent" onClick={handleDetailClick}>
        자세히 보기 →
      </DetailButton>
    </Footer>
  );
};

export default CardFooter;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DetailButton = styled(Button)`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;
