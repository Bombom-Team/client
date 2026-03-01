import styled from '@emotion/styled';
import type { ReactNode } from 'react';

export interface Action {
  icon: ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}

interface FloatingActionButtonsProps {
  top: string;
  left: string;
  actions: Action[];
}

const FloatingActionButtons = ({
  top,
  left,
  actions,
}: FloatingActionButtonsProps) => {
  return (
    <Container top={top} left={left}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          type="button"
          onClick={action.onClick}
          aria-label={action.ariaLabel}
        >
          {action.icon}
        </ActionButton>
      ))}
    </Container>
  );
};

export default FloatingActionButtons;

const Container = styled.div<{ top: string; left: string }>`
  position: fixed;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  z-index: ${({ theme }) => theme.zIndex.floating};
  width: 56px;
  padding: 4px 0;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.dividers};

  transform: translateY(-50%);
`;

const ActionButton = styled.button`
  padding: 8px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  & > svg {
    transition: transform 0.2s ease;
  }

  &:hover > svg {
    transform: scale(1.1);
  }
`;
