import styled from '@emotion/styled';
import { useDevice } from '@bombom/shared/ui-web';
import type { Device } from '@bombom/shared/ui-web';
import { useRouter } from '@tanstack/react-router';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import MaeilMailLogo from '@/assets/svg/maeilmail-logo.svg';
import ServiceSwitcher from '@/components/Header/ServiceSwitcher';

const BOMBOM_SERVICE_URL = 'https://www.bombom.news';

const Header = () => {
  const device = useDevice();
  const router = useRouter();

  const handleBackClick = () => {
    router.history.back();
  };

  return (
    <Container device={device}>
      <ServiceSwitcher />

      <HeaderRow device={device}>
        {device === 'mobile' ? (
          <BackButton
            type="button"
            onClick={handleBackClick}
            aria-label="뒤로가기"
          >
            <BackChevron aria-hidden />
          </BackButton>
        ) : (
          <PCHeaderInner>
            <LogoBox aria-label="매일메일">
              <MaeilMailLogo width={120} />
            </LogoBox>
            <GoToService href={BOMBOM_SERVICE_URL}>서비스 이동</GoToService>
          </PCHeaderInner>
        )}
      </HeaderRow>
    </Container>
  );
};

export default Header;

const Container = styled.header<{ device: Device }>`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: ${({ theme, device }) =>
    `calc(${device === 'pc' ? theme.heights.headerPC : `${theme.heights.headerMobile} + ${theme.safeArea.top}`} + 40px)`};

  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: ${({ theme }) => theme.colors.white};

  transform: translateX(-50%);
`;

const HeaderRow = styled.div<{ device: Device }>`
  padding: ${({ theme, device }) =>
    device === 'pc' ? '8px 16px' : `calc(4px + ${theme.safeArea.top}) 8px 4px`};
  box-shadow: ${({ device }) =>
    device === 'pc'
      ? '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)'
      : '0 8px 12px -6px rgb(0 0 0 / 10%), 0 3px 5px -4px rgb(0 0 0 / 10%)'};

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: ${({ device }) =>
    device === 'pc' ? 'center' : 'space-between'};
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

const GoToService = styled.a`
  padding: 8px 16px;
  border: none;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t5Regular};

  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
