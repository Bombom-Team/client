import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import MaeilMailLogo from '@/assets/svg/maeilmail-logo.svg';

const Header = () => {
  const router = useRouter();
  const { data: userProfile } = useQuery(queries.userProfile());

  const handleBackClick = () => {
    router.history.back();
  };

  return (
    <>
      <MobileHeader>
        <BackButton
          type="button"
          onClick={handleBackClick}
          aria-label="뒤로가기"
        >
          <BackChevron aria-hidden />
        </BackButton>
      </MobileHeader>

      <PCHeader>
        <PCHeaderInner>
          <LogoBox aria-label="매일메일">
            <MaeilMailLogo width={120} />
          </LogoBox>
          {userProfile && (
            <ProfileBox>
              {userProfile.profileImageUrl ? (
                <ProfileImage
                  src={userProfile.profileImageUrl}
                  alt="profile"
                />
              ) : (
                <ProfileAvatar aria-hidden />
              )}
              <ProfileName>{userProfile.nickname}</ProfileName>
            </ProfileBox>
          )}
        </PCHeaderInner>
      </PCHeader>
    </>
  );
};

export default Header;

const MobileHeader = styled.header`
  display: none;

  @media (width <= 768px) {
    position: fixed;
    top: 0;
    z-index: ${({ theme }) => theme.zIndex.header};

    width: 100%;
    height: calc(
      ${({ theme }) =>
        `${theme.heights.headerMobile} + ${theme.safeArea.top}`}
    );
    padding: calc(4px + ${({ theme }) => theme.safeArea.top}) 8px;
    box-shadow:
      0 8px 12px -6px rgb(0 0 0 / 10%),
      0 3px 5px -4px rgb(0 0 0 / 10%);

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: ${({ theme }) => theme.colors.white};
  }
`;

const BackButton = styled.button`
  padding: 4px;

  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BackChevron = styled(ChevronDownIcon)`
  width: 32px;
  height: 32px;

  transform: rotate(90deg);
`;

const PCHeader = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.header};

  width: 100%;
  height: ${({ theme }) => theme.heights.headerPC};
  padding: 8px 16px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.white};

  @media (width <= 768px) {
    display: none;
  }
`;

const PCHeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileBox = styled.div`
  padding: 8px 12px;
  border-radius: 12px;

  display: flex;
  gap: 12px;
  align-items: center;

  background: ${({ theme }) => theme.colors.white};
`;

const ProfileAvatar = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
`;

const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;

  object-fit: cover;
`;

const ProfileName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;
