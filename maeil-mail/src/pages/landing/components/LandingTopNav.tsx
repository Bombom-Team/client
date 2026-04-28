import styled from '@emotion/styled';
import Logo from '@/assets/svg/maeilmail-logo.svg';
import { NAV_ITEMS } from '@/pages/landing/constants/landingContent';

const LandingTopNav = () => {
  return (
    <Container>
      <NavInner>
        <LogoRow>
          <Logo width={110} />
        </LogoRow>
        <NavMenu>
          {NAV_ITEMS.map(({ href, label }) => (
            <NavLink key={label} href={href}>
              {label}
            </NavLink>
          ))}
        </NavMenu>
        <NavAction href="#about">매일메일 보기</NavAction>
      </NavInner>
    </Container>
  );
};

export default LandingTopNav;

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 100%;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(0 0 0 / 6%);

  background: rgb(255 255 255 / 88%);
  color: ${({ theme }) => theme.colors.textPrimary};

  backdrop-filter: blur(12px);
`;

const NavInner = styled.div`
  max-width: 1140px;
  margin: 0 auto;

  display: grid;
  gap: 10px;
  align-items: center;

  grid-template-columns: 1fr;

  @media (width >= 920px) {
    gap: 18px;
    grid-template-columns: auto 1fr auto;
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 14px;
  align-items: center;

  @media (width <= 919px) {
    justify-content: center;
  }
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

const NavAction = styled.a`
  padding: 8px 14px;
  border: 1px solid currentcolor;
  border-radius: 2px;

  justify-self: start;

  color: inherit;
  font: ${({ theme }) => theme.fonts.t5Regular};
  letter-spacing: 0.04em;

  transition: opacity 180ms ease;

  &:hover {
    opacity: 0.68;
  }

  @media (width >= 920px) {
    justify-self: end;
  }
`;
