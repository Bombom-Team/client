import styled from '@emotion/styled';
import type { ComponentProps, PropsWithChildren } from 'react';

const CardContainer = ({
  children,
  ...props
}: PropsWithChildren<ComponentProps<'button'>>) => {
  return <Container {...props}>{children}</Container>;
};

export default CardContainer;

const Container = styled.button`
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

  transition: all 0.2s ease;

  &:disabled {
    box-shadow: none;

    background-color: ${({ theme }) => theme.colors.disabledBackground};

    border-color: ${({ theme }) => theme.colors.disabledBackground};
    cursor: not-allowed;
    transform: none;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);

    border-color: ${({ theme }) => theme.colors.primary};

    transform: translateY(-2px);
  }
`;
