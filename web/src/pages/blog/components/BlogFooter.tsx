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

        <RightSection>
          <Flex
            gap={device === 'mobile' ? 16 : 24}
            align="center"
            justify="center"
          >
            <SocialLink
              href="https://bombom-newsletter.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tistory"
            >
              <TistoryIcon width={24} height={24} />
            </SocialLink>
            <SocialLink
              href="https://youtube.com/channel/UCKvpDtCispdhOXQfGopKLeQ?si=3APz7gYrHv7JQ8uX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <YoutubeIcon width={28} height={28} />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/bombom___official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon width={24} height={24} />
            </SocialLink>
          </Flex>
          <Copyright>© 2026 BOMBOM. ALL RIGHTS RESERVED.</Copyright>
        </RightSection>
      </FooterWrapper>
    </Container>
  );
};

export default BlogFooter;

const Container = styled.footer<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '48px 0' : '64px 0')};
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  background-color: ${({ theme }) => theme.colors.white};
`;

const FooterWrapper = styled.div<{ device: Device }>`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ device }) => (device === 'mobile' ? '0 20px' : '0 60px')};

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const LogoText = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const Description = styled.p<{ device: Device }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};
  line-height: 1.75;
`;

const RightSection = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: flex-end;
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

const Copyright = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
  letter-spacing: 1px;
`;
