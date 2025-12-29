import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import HeaderLogo from './HeaderLogo';
import HeaderProfile from './HeaderProfile';
import LoginButton from './LoginButton';
import Button from '../Button/Button';
import { useAuth } from '@/contexts/AuthContext';
import MegaphoneIcon from '#/assets/svg/megaphone.svg';

const MobileMainHeader = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <Container>
      <HeaderLogo device="mobile" />
      <UserInfoWrapper>
        <Button
          onClick={() => navigate({ to: '/notice' })}
          variant={'transparent'}
        >
          <MegaphoneIcon width={22} height={24} />
        </Button>
        {userProfile ? (
          <HeaderProfile userProfile={userProfile} device="mobile" />
        ) : (
          <LoginButton />
        )}
      </UserInfoWrapper>
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
  height: calc(
    ${({ theme }) => theme.heights.headerMobile} + env(safe-area-inset-top)
  );
  padding: 8px 12px;
  padding-top: calc(8px + env(safe-area-inset-top));
  box-shadow:
    0 8px 12px -6px rgb(0 0 0 / 10%),
    0 3px 5px -4px rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: ${({ theme }) => theme.colors.white};
`;
const UserInfoWrapper = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;
