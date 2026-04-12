import styled from '@emotion/styled';
import type { ReactNode } from 'react';

export interface Action {
  icon: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}

interface FloatingActionPanelProps {
  top: string;
  left: string;
  actions: Action[];
}

const FloatingActionPanel = ({
  top,
  left,
  actions,
}: FloatingActionPanelProps) => {
  return (
    <Container top={top} left={left}>
      {actions.map((action, index) =>
        action.onClick ? (
          <ActionButton
            key={`${action.ariaLabel}-${index}`}
            type="button"
            onClick={action.onClick}
            aria-label={action.ariaLabel}
          >
            {action.icon}
          </ActionButton>
        ) : (
          <ActionItem key={index}>{action.icon}</ActionItem>
        ),
      )}
    </Container>
  );
};

export default FloatingActionPanel;

const Container = styled.div<{ top: string; left: string }>`
  position: fixed;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  z-index: ${({ theme }) => theme.zIndex.floating};
  width: 3.5rem;
  padding: 0.25rem 0;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.5rem rgb(0 0 0 / 5%);

  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.dividers};

  transform: translateY(-50%);
`;

const ActionButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
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

const ActionItem = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;
