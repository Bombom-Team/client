import styled from '@emotion/styled';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { ReactNode } from 'react';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
`;

const MainContent = styled.div`
  margin-left: 256px;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ContentArea = styled.main`
  padding: ${({ theme }) => theme.spacing.xl};

  flex: 1;

  background-color: ${({ theme }) => theme.colors.background};
`;

interface LayoutProps {
  children: ReactNode;
  title: string;
  rightAction?: ReactNode;
}

export const Layout = ({ children, title, rightAction }: LayoutProps) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header title={title} rightAction={rightAction} />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};
