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
    if (device === 'mobile') return '0 1rem';
    if (device === 'tablet') return '0 2.5rem';
    return '0 3.75rem';
  }};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(0.375rem);
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
  gap: ${({ device }) => (device === 'mobile' ? '0.5rem' : '0.75rem')};
  align-items: center;
`;

const LogoImage = styled.img<{ device: Device }>`
  width: ${({ device }) => {
    if (device === 'mobile') return '2.5rem';
    if (device === 'tablet') return '2.75rem';
    return '3rem';
  }};
  height: ${({ device }) => {
    if (device === 'mobile') return '2.5rem';
    if (device === 'tablet') return '2.75rem';
    return '3rem';
  }};
  border-radius: ${({ device }) => {
    if (device === 'mobile') return '0.75rem';
    if (device === 'tablet') return '0.875rem';
    return '1rem';
  }};
`;

const Title = styled.h1<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const GoToService = styled(Link)<{ device: Device }>`
  padding: ${({ device }) =>
    device === 'mobile' ? '0.5rem 0.75rem' : '0.5rem 1rem'};
  border: none;
  border-radius: 0.75rem;

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
