import styled from '@emotion/styled';
import HeaderLogo from '@/components/Header/HeaderLogo';
import LoginButton from '@/components/Header/LoginButton';
import ServiceSwitcher from '@/components/Header/ServiceSwitcher';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@bombom/shared/ui-web';
import type { Device } from '@bombom/shared/ui-web';

const BOMBOM_SERVICE_URL = 'https://bombom.news';

const LandingHeader = () => {
  const device = useDevice();
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <Container device={device}>
      <ServiceSwitcher />
      <HeaderRow device={device}>
        <HeaderWrapper>
          <HeaderLogo />
          {isLoading ? (
            <Skeleton width="100px" height="40px" borderRadius={12} />
          ) : isLoggedIn ? (
            <GoToService device={device} href={BOMBOM_SERVICE_URL}>
              서비스 이동
            </GoToService>
          ) : (
            <LoginButton />
          )}
        </HeaderWrapper>
      </HeaderRow>
    </Container>
  );
};
export default LandingHeader;

const Container = styled.header<{ device: Device }>`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: ${({ theme, device }) =>
    `calc(${device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile} + 32px)`};

  display: flex;
  flex-direction: column;
  align-items: stretch;

  background: rgb(249 248 248 / 60%);

  backdrop-filter: blur(10px);

  transform: translateX(-50%);
`;

const HeaderRow = styled.div<{ device: Device }>`
  padding: ${({ device }) => (device === 'pc' ? '8px 16px' : '8px 12px')};

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 1280px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GoToService = styled.a<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '8px 12px' : '8px 16px')};
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
