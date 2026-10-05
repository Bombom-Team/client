import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import HeaderLogo from './HeaderLogo';
import HeaderProfile from './HeaderProfile';
import LoginButton from './LoginButton';
import Button from '../Button/Button';
import UnreadDot from '../UnreadDot/UnreadDot';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import HeadsetIcon from '#/assets/svg/headset.svg';
import MegaphoneIcon from '#/assets/svg/megaphone.svg';

const MobileMainHeader = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { data: unreadStatus } = useQuery(queries.inquiryUnreadStatus());

  return (
    <Container>
      <MainRow>
        <HeaderLogo />
        <UserInfoWrapper>
          <IconButtonGroup>
            <NavButton
              onClick={() => navigate({ to: '/support' })}
              variant="transparent"
            >
              <HeadsetIconWrapper>
                <HeadsetIcon width={20} height={20} />
                {unreadStatus?.hasUnread && <UnreadDot />}
              </HeadsetIconWrapper>
            </NavButton>
            <NavButton
              onClick={() => navigate({ to: '/notice' })}
              variant="transparent"
            >
              <MegaphoneIcon width={20} height={20} />
            </NavButton>
          </IconButtonGroup>
          {userProfile ? (
            <HeaderProfile userProfile={userProfile} device="mobile" />
          ) : (
            <LoginButtonWrapper>
              <LoginButton />
            </LoginButtonWrapper>
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
    `calc(${theme.heights.headerMobile} + ${theme.safeArea.top})`};
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
  padding: 0 12px;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled(Button)`
  padding: 8px 12px;

  display: flex;
  gap: 0;
  flex-direction: column;

  :hover {
    background: none;
  }
`;

const IconButtonGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const LoginButtonWrapper = styled.div`
  margin-left: 4px;
`;

const HeadsetIconWrapper = styled.span`
  position: relative;

  display: inline-flex;

  line-height: 0;
`;
