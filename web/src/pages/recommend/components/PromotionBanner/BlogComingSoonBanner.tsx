import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import logo from '#/assets/avif/logo.avif';

const BlogComingSoonBanner = () => {
  const device = useDevice();

  return (
    <Container device={device} to="/blog">
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

export default BlogComingSoonBanner;

const Container = styled(Link)<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: ${({ device }) => (device ? '32px 36px' : '24px 20px')};
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
  max-width: ${({ device }) => (device === 'pc' ? '600px' : '100%')};

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BannerImage = styled.img<{ device: Device }>`
  width: 100%;
  height: auto;
  max-width: ${({ device }) => (device === 'pc' ? '480px' : '300px')};
`;

const Logo = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  align-items: center;
`;

const LogoImage = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '40px' : '48px')};
  height: ${({ device }) => (device === 'mobile' ? '40px' : '48px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;
