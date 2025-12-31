import styled from '@emotion/styled';
import type { ComponentProps, PropsWithChildren } from 'react';

const CardContainer = ({
  children,
  ...props
}: PropsWithChildren<ComponentProps<'div'>>) => {
  return <Container {...props}>{children}</Container>;
};

export default CardContainer;

const Container = styled.div`
  width: 100%;
  height: 172px;
  min-width: 320px;
  max-width: 440px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 14px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);

    border-color: ${({ theme }) => theme.colors.primary};

    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
