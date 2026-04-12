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
      <HeaderWrapper device={device}>
        <Logo
          to="/blog"
          device={device}
          onClick={() =>
            trackEvent({
              category: 'Navigation',
              action: '로고 클릭 (Blog)',
              label: '블로그 메인 페이지로 이동',
            })
          }
        >
          <LogoImage src={logo} alt="logo" device={device} />
          <Title device={device}>봄봄 Blog</Title>
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
  padding: ${({ device }) => {
    if (device === 'mobile') return '0 16px';
    if (device === 'tablet') return '0 40px';
    return '0 60px';
  }};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(6px);
`;

const HeaderWrapper = styled.div<{ device: Device }>`
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  align-items: center;
`;

const LogoImage = styled.img<{ device: Device }>`
  width: ${({ device }) => {
    if (device === 'mobile') return '40px';
    if (device === 'tablet') return '44px';
    return '48px';
  }};
  height: ${({ device }) => {
    if (device === 'mobile') return '40px';
    if (device === 'tablet') return '44px';
    return '48px';
  }};
  border-radius: ${({ device }) => {
    if (device === 'mobile') return '12px';
    if (device === 'tablet') return '14px';
    return '16px';
  }};
`;

const Title = styled.h1<{ device: Device }>`
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
  font: ${({ theme }) => theme.fonts.body2};

  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
