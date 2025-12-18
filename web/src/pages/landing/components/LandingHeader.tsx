import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import HeaderLogo from '@/components/Header/HeaderLogo';
import LoginButton from '@/components/Header/LoginButton';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const LandingHeader = () => {
  const device = useDevice();
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <Container device={device}>
      <HeaderWrapper>
        <HeaderLogo device={device} />
        {isLoading ? (
          <Skeleton width="100px" height="40px" borderRadius={12} />
        ) : isLoggedIn ? (
          <GoToService device={device} to="/">
            서비스 이동
          </GoToService>
        ) : (
          <LoginButton />
        )}
      </HeaderWrapper>
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
    device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile};
  padding: ${({ device }) => (device === 'pc' ? '8px 16px' : '8px 12px')};

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(249 248 248 / 60%);

  backdrop-filter: blur(10px);

  transform: translateX(-50%);
`;

const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 1280px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GoToService = styled(Link)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '8px 12px' : '8px 16px')};
  border: none;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.caption : theme.fonts.body2};

  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
