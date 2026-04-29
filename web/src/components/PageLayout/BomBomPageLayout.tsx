import styled from '@emotion/styled';
import {
  MOBILE_HORIZONTAL_PADDING,
  PC_HORIZONTAL_PADDING,
} from './PageLayout.constants';
import PCHeader from '../Header/PCHeader';
import { useActiveNav } from '@/hooks/useActiveNav';
import { useDevice } from '@/hooks/useDevice';
import type { PropsWithChildren } from 'react';

const BomBomPageLayout = ({ children }: PropsWithChildren) => {
  const activeNav = useActiveNav();
  const device = useDevice();
  const isPC = device === 'pc';

  return (
    <Container isPC={isPC}>
      {isPC && <PCHeader activeNav={activeNav} />}
      {children}
    </Container>
  );
};

export default BomBomPageLayout;

const Container = styled.div<{ isPC: boolean }>`
  min-height: 100dvh;
  padding: ${({ isPC, theme }) => {
    const sidePadding = isPC
      ? `${PC_HORIZONTAL_PADDING}px`
      : `${MOBILE_HORIZONTAL_PADDING}px`;

    const headerHeight = isPC
      ? theme.heights.headerPC
      : theme.heights.headerMobile;

    const topPadding = `calc(${headerHeight} + ${theme.safeArea.top} + ${sidePadding} + 40px)`;
    const bottomPadding = isPC
      ? `calc(${theme.safeArea.bottom} + ${sidePadding})`
      : `calc(${theme.heights.bottomNav} + ${theme.safeArea.bottom} + ${sidePadding})`;

    return `${topPadding} ${sidePadding} ${bottomPadding} ${sidePadding}`;
  }};

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  overflow-x: clip;

  scrollbar-gutter: stable;
`;
