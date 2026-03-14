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
  width: 44px;
  height: 44px;
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
  width: 44px;
  height: 44px;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.white};

  display: flex;
  align-items: center;
  justify-content: center;
`;
