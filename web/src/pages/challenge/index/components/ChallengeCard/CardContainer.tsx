import styled from '@emotion/styled';
import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  PropsWithChildren,
} from 'react';

interface CardContainerProps extends Omit<ComponentProps<'div'>, 'onClick'> {
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const CardContainer = ({
  children,
  disabled,
  onClick,
  ...props
}: PropsWithChildren<CardContainerProps>) => {
  const interactive = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <Container
      {...props}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={interactive ? onClick : undefined}
      onKeyDown={handleKeyDown}
    >
      {children}
    </Container>
  );
};

export default CardContainer;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  min-width: 280px;
  max-width: 440px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
  text-align: left;
  cursor: pointer;

  transition: all 0.2s ease;

  &[data-disabled] {
    box-shadow: none;

    background-color: ${({ theme }) => theme.colors.disabledBackground};

    border-color: ${({ theme }) => theme.colors.disabledBackground};
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not([data-disabled]) {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);

    border-color: ${({ theme }) => theme.colors.primary};

    transform: translateY(-2px);
  }
`;
