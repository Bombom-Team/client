import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import HeaderLogo from './HeaderLogo';
import HeaderProfile from './HeaderProfile';
import LoginButton from './LoginButton';
import ServiceSwitcher from './ServiceSwitcher';
import Button from '../Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import MegaphoneIcon from '#/assets/svg/megaphone.svg';

const MobileMainHeader = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <Container>
      <ServiceSwitcher />
      <MainRow>
        <HeaderLogo />
        <UserInfoWrapper>
          <NavButton
            onClick={() => navigate({ to: '/notice' })}
            variant="transparent"
          >
            <MegaphoneIcon width={20} height={20} />
          </NavButton>
          {userProfile ? (
            <HeaderProfile userProfile={userProfile} device="mobile" />
          ) : (
            <LoginButton />
          )}
        </UserInfoWrapper>
      </MainRow>
    </Container>
  );
};

export default MobileMainHeader;

const Container = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: ${({ theme }) =>
    `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 32px)`};
  padding-top: ${({ theme }) => theme.safeArea.top};
  box-shadow:
    0 8px 12px -6px rgb(0 0 0 / 10%),
    0 3px 5px -4px rgb(0 0 0 / 10%);

  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: ${({ theme }) => theme.colors.white};
`;

const MainRow = styled.div`
  padding: 8px 12px;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const NavButton = styled(Button)`
  padding: 0;

  display: flex;
  gap: 0;
  flex-direction: column;

  :hover {
    background: none;
  }
`;
