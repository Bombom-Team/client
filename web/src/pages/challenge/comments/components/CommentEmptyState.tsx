import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { PropsWithChildren } from 'react';

const CommentEmptyState = ({ children }: PropsWithChildren) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return <Container isMobile={isMobile}>{children}</Container>;
};

export default CommentEmptyState;

const Container = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '24px' : '32px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
