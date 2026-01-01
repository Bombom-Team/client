import styled from '@emotion/styled';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import HeaderNavButtons from '@/components/Header/HeaderNavButtons';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import { useActiveNav } from '@/hooks/useActiveNav';
import { useDevice } from '@/hooks/useDevice';

export const Route = createFileRoute('/_bombom/_main')({
  component: RouteComponent,
});

function RouteComponent() {
  const activeNav = useActiveNav();
  const device = useDevice();
  const isPC = device === 'pc';

  return (
    <>
      {!isPC && <MobileMainHeader />}
      <Outlet />
      {!isPC && (
        <BottomNavWrapper>
          <HeaderNavButtons activeNav={activeNav} device={device} />
        </BottomNavWrapper>
      )}
    </>
  );
}

const BottomNavWrapper = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  height: calc(
    ${({ theme }) => theme.heights.bottomNav} + env(safe-area-inset-bottom)
  );
  padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.colors.stroke};
  box-shadow: 0 -8px 12px -6px rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: space-around;

  background: ${({ theme }) => theme.colors.white};
`;
