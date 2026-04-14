import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
const BlogComingSoonBanner = () => {
  const device = useDevice();

  return (
    <Container device={device} to="/blog">
      <Content device={device}>
        <Title device={device}>Coming Soon</Title>
        <Description device={device}>봄봄 블로그가 찾아옵니다.</Description>
      </Content>
    </Container>
  );
};

export default BlogComingSoonBanner;

const Container = styled(Link)<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: 280px;
  padding: ${({ device }) => (device ? '32px 36px' : '24px 20px')};
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primaryInfo};

  &::after {
    position: absolute;
    right: 4px;
    bottom: ${({ device }) => (device === 'pc' ? '-4px' : '0')};

    color: rgb(254 94 4 / 12%);
    font-weight: 800;
    font-size: ${({ device }) => {
      if (device === 'pc') return '120px';
      if (device === 'tablet') return '100px';
      return '54px';
    }};
    line-height: 1;

    content: 'Blog';
  }
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

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.black};
  font-weight: 800;
  font-size: ${({ device }) => {
    if (device === 'pc') return '78px';
    if (device === 'tablet') return '62px';
    return '54px';
  }};
  line-height: 1;
  letter-spacing: -0.05em;
  text-align: center;
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
  text-align: center;

  word-break: keep-all;
`;
