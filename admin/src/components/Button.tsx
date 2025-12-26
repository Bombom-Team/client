import styled from '@emotion/styled';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  padding: ${({ size, theme }) => {
    if (size === 'sm') return `${theme.spacing.sm} ${theme.spacing.md}`;
    if (size === 'lg') return `${theme.spacing.md} ${theme.spacing.xl}`;
    return `${theme.spacing.sm} ${theme.spacing.lg}`;
  }};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.colors.gray200;
    if (variant === 'danger') return theme.colors.error;
    if (variant === 'outline') return 'transparent';
    return theme.colors.primary;
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.colors.gray700;
    if (variant === 'outline') return theme.colors.error;
    return theme.colors.white;
  }};
  border: ${({ variant, theme }) => {
    if (variant === 'outline') return `1px solid ${theme.colors.error}`;
    return 'none';
  }};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ size, theme }) => {
    if (size === 'sm') return theme.fontSize.sm;
    if (size === 'lg') return theme.fontSize.lg;
    return theme.fontSize.base;
  }};

  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.colors.gray300;
    if (variant === 'danger') return '#DC2626';
    if (variant === 'outline') return theme.colors.gray50;
    return theme.colors.primaryHover;
  }};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton variant={variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
