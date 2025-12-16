import styled from '@emotion/styled';
import HeaderLogo from '@/components/Header/HeaderLogo';
import LoginButton from '@/components/Header/LoginButton';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const LandingHeader = () => {
  const device = useDevice();
  return (
    <Container device={device}>
      <HeaderWrapper>
        <HeaderLogo device={device} />
        <LoginButton />
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
