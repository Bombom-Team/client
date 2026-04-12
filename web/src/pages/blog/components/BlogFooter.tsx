import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import InstagramIcon from '#/assets/svg/instagram.svg';
import TistoryIcon from '#/assets/svg/tistory.svg';
import YoutubeIcon from '#/assets/svg/youtube.svg';

const BlogFooter = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <FooterWrapper device={device}>
        <Flex gap={device === 'mobile' ? 4 : 8} direction="column">
          <LogoText device={device}>봄봄 Blog</LogoText>
          <Description device={device}>
            읽고 남기고 쌓는 뉴스레터 리딩 플랫폼
          </Description>
        </Flex>

        <Flex
          gap={16}
          direction="column"
          align={device === 'mobile' ? 'flex-start' : 'flex-end'}
        >
          <Flex
            gap={device === 'mobile' ? 20 : 24}
            align="center"
            justify={device === 'mobile' ? 'flex-start' : 'center'}
          >
            <SocialLink
              href="https://bombom-newsletter.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tistory"
            >
              <TistoryIcon
                width={device === 'mobile' ? 20 : 24}
                height={device === 'mobile' ? 20 : 24}
              />
            </SocialLink>
            <SocialLink
              href="https://youtube.com/channel/UCKvpDtCispdhOXQfGopKLeQ?si=3APz7gYrHv7JQ8uX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YoutubeIcon
                width={device === 'mobile' ? 24 : 28}
                height={device === 'mobile' ? 24 : 28}
              />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/bombom___official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon
                width={device === 'mobile' ? 20 : 24}
                height={device === 'mobile' ? 20 : 24}
              />
            </SocialLink>
          </Flex>
          <Copyright device={device}>
            © 2026 BOMBOM. ALL RIGHTS RESERVED.
          </Copyright>
        </Flex>
      </FooterWrapper>
    </Container>
  );
};

export default BlogFooter;

const Container = styled.footer<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => {
    if (device === 'mobile') return '32px 16px';
    if (device === 'tablet') return '48px 40px';
    return '48px 60px';
  }};
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  background-color: ${({ theme }) => theme.colors.white};
`;

const FooterWrapper = styled.div<{ device: Device }>`
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '32px' : '0')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
  align-items: flex-start;
  justify-content: space-between;
`;

const LogoText = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;
`;

const Description = styled.p<{ device: Device }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
  line-height: 1.75;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease;

  svg {
    display: block;

    color: ${({ theme }) => theme.colors.icons};

    fill: ${({ theme }) => theme.colors.icons};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const Copyright = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
  letter-spacing: 0.0625rem;
`;
