import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import HeaderLogo from './HeaderLogo';
import HeaderNavButtons from './HeaderNavButtons';
import HeaderProfile from './HeaderProfile';
import LoginButton from './LoginButton';
import Button from '../Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import type { Nav } from '@/types/nav';
import MegaphoneIcon from '#/assets/svg/megaphone.svg';

interface PCHeaderProps {
  activeNav: Nav;
}

const PCHeader = ({ activeNav }: PCHeaderProps) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <HeaderContainer>
      <HeaderInner>
        <HeaderLogo />
        <NavWrapper>
          <HeaderNavButtons activeNav={activeNav} device="pc" />
        </NavWrapper>

        <UserInfoWrapper>
          <Button
            onClick={() => navigate({ to: '/notice' })}
            variant={'transparent'}
          >
            <MegaphoneIcon width={22} height={24} />
          </Button>
          {userProfile ? (
            <HeaderProfile userProfile={userProfile} device="pc" />
          ) : (
            <LoginButton />
          )}
        </UserInfoWrapper>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default PCHeader;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: ${({ theme }) => theme.heights.headerPC};
  padding: 0.5rem 1rem;
  box-shadow:
    0 0.625rem 0.9375rem -0.1875rem rgb(0 0 0 / 10%),
    0 0.25rem 0.375rem -0.25rem rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.white};
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavWrapper = styled.nav`
  padding: 0.25rem;
  border-radius: 0.875rem;

  display: flex;
  gap: 0.5rem;
  align-items: center;

  background: ${({ theme }) => theme.colors.white};
`;

const UserInfoWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
`;
