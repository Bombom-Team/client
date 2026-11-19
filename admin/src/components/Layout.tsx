import styled from '@emotion/styled';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { ReactNode } from 'react';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
`;

const MainContent = styled.div`
  /* flex 자식의 기본값은 min-width: auto라 내용이 넓으면 이 영역이 부풀어
     헤더까지 화면 밖으로 밀어낸다. 0으로 풀어 사이드바 옆 폭을 지키게 한다. */
  min-width: 0;
  margin-left: 256px;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ContentArea = styled.main`
  min-width: 0;
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
