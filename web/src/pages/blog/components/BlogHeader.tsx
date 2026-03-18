import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { Device } from '@/hooks/useDevice';
import logo from '#/assets/avif/logo.avif';

const BlogHeader = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <HeaderWrapper>
        <Logo
          to="/blog"
          onClick={() =>
            trackEvent({
              category: 'Navigation',
              action: '로고 클릭 (Blog)',
              label: '블로그 메인 페이지로 이동',
            })
          }
        >
          <LogoImage src={logo} alt="logo" />
          <Title>봄봄 Blog</Title>
        </Logo>

        <GoToService device={device} to="/">
          서비스 이동
        </GoToService>
      </HeaderWrapper>
    </Container>
  );
};

export default BlogHeader;

const Container = styled.header<{ device: Device }>`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: ${({ theme, device }) =>
    device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile};
  padding: ${({ device }) => (device === 'pc' ? '8px 16px' : '8px 12px')};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(6px);
`;

const HeaderWrapper = styled.div`
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 16px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
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
