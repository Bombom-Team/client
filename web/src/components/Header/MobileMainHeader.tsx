import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import HeaderLogo from './HeaderLogo';
import HeaderProfile from './HeaderProfile';
import LoginButton from './LoginButton';
import Button from '../Button/Button';
import Text from '../Text';
import { useAuth } from '@/contexts/AuthContext';
import MegaphoneIcon from '#/assets/svg/megaphone.svg';
import PenIcon from '#/assets/svg/pen.svg';

const MobileMainHeader = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  return (
    <Container>
      <HeaderLogo device="mobile" />
      <UserInfoWrapper>
        <NavButton
          onClick={() => navigate({ to: '/blog' })}
          variant="transparent"
        >
          <PenIcon width={20} height={20} />
          <Label font="body4">블로그</Label>
        </NavButton>
        <NavButton
          onClick={() => navigate({ to: '/notice' })}
          variant="transparent"
        >
          <MegaphoneIcon width={20} height={20} />
          <Label font="body4">공지사항</Label>
        </NavButton>
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
    ${({ theme }) => `${theme.heights.headerMobile} + ${theme.safeArea.top}`}
  );
  padding: 8px 12px;
  padding-top: calc(8px + ${({ theme }) => theme.safeArea.top});
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

const Label = styled(Text)`
  text-align: center;
`;
