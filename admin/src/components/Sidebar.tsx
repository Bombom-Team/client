import styled from '@emotion/styled';
import { Link, useRouterState } from '@tanstack/react-router';
import { FiBell, FiHome, FiMail, FiUsers } from 'react-icons/fi';

export const Sidebar = () => {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <SidebarContainer>
      <Logo>
        <LogoText>BomBom Admin</LogoText>
      </Logo>
      <Nav>
        <NavItem to="/" isActive={currentPath === '/'}>
          <FiHome />
          <span>대시보드</span>
        </NavItem>
        <NavItem to="/members" isActive={currentPath.startsWith('/members')}>
          <FiUsers />
          <span>멤버 관리</span>
        </NavItem>
        <NavItem
          to="/challenges"
          isActive={currentPath.startsWith('/challenges')}
        >
          <FiFlag />
          <span>챌린지</span>
        </NavItem>
        <NavItem to="/notices" isActive={currentPath.startsWith('/notices')}>
          <FiBell />
          <span>공지사항</span>
        </NavItem>
        <NavItem
          to="/newsletters"
          isActive={currentPath.startsWith('/newsletters')}
        >
          <FiMail />
          <span>뉴스레터 관리</span>
        </NavItem>
      </Nav>
      <Footer>© 2025 BomBom. All rights reserved.</Footer>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 256px;
  height: 100vh;
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const LogoText = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const Nav = styled.nav`
  padding: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const NavItem = styled(Link)<{ isActive: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.gray50 : 'transparent'};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.gray700};
  font-weight: ${({ theme, isActive }) =>
    isActive ? theme.fontWeight.semibold : theme.fontWeight.normal};

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: ${({ theme }) => theme.fontSize.xl};
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
