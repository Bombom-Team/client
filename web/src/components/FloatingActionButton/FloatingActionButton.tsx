import styled from '@emotion/styled';
import { useState } from 'react';
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { ReactNode } from 'react';

interface FloatingActionButtonProps {
  icon: ReactNode;
  children: ReactNode;
}

const FloatingActionButton = ({
  icon,
  children,
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const device = useDevice();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const floatingRef = useClickOutsideRef<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  return (
    <div ref={floatingRef}>
      <FloatingButton onClick={toggleMenu} device={device}>
        {icon}
      </FloatingButton>
      {isOpen && <FloatingMenu device={device}>{children}</FloatingMenu>}
    </div>
  );
};

export default FloatingActionButton;

const FloatingButton = styled.button<{ device: Device }>`
  position: fixed;
  right: 1.25rem;
  bottom: calc(
    ${({ theme }) =>
      `${theme.heights.bottomNav} + ${theme.safeArea.bottom} + 1.5rem`}
  );
  z-index: ${({ theme }) => theme.zIndex.overlay};
  width: 3.5rem;
  height: 3.5rem;
  border: none;
  border-radius: 50%;
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 15%);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};

  &:hover {
    box-shadow: 0 0.375rem 1rem rgb(0 0 0 / 20%);
  }
`;

const FloatingMenu = styled.div<{ device: Device }>`
  position: fixed;
  right: 1.25rem;
  bottom: calc(
    ${({ theme }) =>
      `${theme.heights.bottomNav} + ${theme.safeArea.bottom} + 5.75rem`}
  );
  z-index: ${({ theme }) => theme.zIndex.floating};
  min-width: 120px;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 15%);

  display: flex;
  gap: 0.5rem;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;
