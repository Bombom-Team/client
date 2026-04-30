import styled from '@emotion/styled';
import { useDevice } from '@bombom/shared/ui-web';
import Logo from '@/assets/svg/maeilmail-logo.svg';

const NAV_ITEMS = [
  { href: '#about', label: '소개' },
  { href: '#faq', label: 'FAQ' },
] as const;

const LandingTopNav = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container>
      <NavInner isMobile={isMobile}>
        <LogoRow>
          <Logo width={110} />
        </LogoRow>
        <NavMenu isMobile={isMobile}>
          {NAV_ITEMS.map(({ href, label }) => (
            <NavLink key={label} href={href}>
              {label}
            </NavLink>
          ))}
        </NavMenu>
        <NavAction href="#about" isMobile={isMobile}>
          매일메일 보기
        </NavAction>
      </NavInner>
    </Container>
  );
};

export default LandingTopNav;

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(0 0 0 / 6%);

  background: rgb(255 255 255 / 88%);
  color: ${({ theme }) => theme.colors.textPrimary};

  backdrop-filter: blur(12px);
`;

const NavInner = styled.div<{ isMobile: boolean }>`
  max-width: 1140px;
  margin: 0 auto;

  display: grid;
  gap: ${({ isMobile }) => (isMobile ? '10px' : '18px')};
  align-items: center;

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? '1fr' : 'auto 1fr auto'};
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
`;

const NavMenu = styled.nav<{ isMobile: boolean }>`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: ${({ isMobile }) => (isMobile ? 'center' : 'flex-start')};
`;

const NavLink = styled.a`
  color: inherit;
  font: ${({ theme }) => theme.fonts.t5Regular};

  opacity: 0.82;
  transition: opacity 180ms ease;

  &:hover {
    opacity: 1;
  }
`;

const NavAction = styled.a<{ isMobile: boolean }>`
  padding: 8px 14px;
  border: 1px solid currentcolor;
  border-radius: 2px;

  justify-self: ${({ isMobile }) => (isMobile ? 'start' : 'end')};

  color: inherit;
  font: ${({ theme }) => theme.fonts.t5Regular};
  letter-spacing: 0.04em;

  transition: opacity 180ms ease;

  &:hover {
    opacity: 0.68;
  }
`;
