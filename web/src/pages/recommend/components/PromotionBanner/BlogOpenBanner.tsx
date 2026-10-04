import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import logo from '#/assets/avif/logo.avif';

const BlogOpenBanner = () => {
  const device = useDevice();

  return (
    <Container to="/blog">
      <Content device={device}>
        <BannerImage
          device={device}
          src="/assets/png/blog-banner.png"
          alt="Blog Banner"
        />
        <Logo device={device}>
          <LogoImage src={logo} alt="logo" device={device} />
          <Title>Blog</Title>
        </Logo>
      </Content>
    </Container>
  );
};

export default BlogOpenBanner;

const Container = styled(Link)`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: clamp(12px, 3cqw, 24px) clamp(24px, 4cqw, 36px);
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f7f3e0;
`;

const Content = styled.div<{ device: Device }>`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '600px' : '100%')};

  display: flex;
  gap: clamp(4px, 1.5cqw, 12px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BannerImage = styled.img<{ device: Device }>`
  width: 100%;
  height: auto;
  min-height: 0;
  max-width: ${({ device }) => (device === 'pc' ? '420px' : '300px')};

  object-fit: contain;
`;

const Logo = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-shrink: 0;
  align-items: center;
`;

const LogoImage = styled.img<{ device: Device }>`
  width: ${({ device }) =>
    device === 'mobile'
      ? 'clamp(24px, 6cqw, 40px)'
      : 'clamp(24px, 6cqw, 52px)'};
  height: auto;
  border-radius: ${({ device }) => (device === 'mobile' ? '12px' : '18px')};
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t13Bold};
  font-size: clamp(20px, 4cqw, 32px);
  line-height: 1.35;
`;
