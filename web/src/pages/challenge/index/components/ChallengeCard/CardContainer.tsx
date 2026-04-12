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
  height: 13.75rem;
  min-width: 280px;
  max-width: 440px;
  padding: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 1rem;

  display: flex;
  gap: 1rem;
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
    box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 8%);

    border-color: ${({ theme }) => theme.colors.primary};

    transform: translateY(-0.125rem);
  }
`;
