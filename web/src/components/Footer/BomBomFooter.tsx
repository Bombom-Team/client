import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import InstagramIcon from '#/assets/svg/instagram.svg';
import YoutubeIcon from '#/assets/svg/youtube.svg';

const TEAM_EMAIL = 'attractionmanager@gmail.com';

const BomBomFooter = () => {
  const device = useDevice();

  if (device === 'mobile') return null;

  return (
    <Container device={device}>
      <FooterWrapper device={device}>
        <Flex gap={8} direction="column">
          <LogoText>봄봄</LogoText>
          <Description>읽고 남기고 쌓는 뉴스레터 리딩 플랫폼</Description>
        </Flex>

        <Flex gap={16} direction="column" align="flex-end">
          <PolicyLinkWrapper>
            <PolicyLink
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보 처리방침
            </PolicyLink>
          </PolicyLinkWrapper>
          <Flex gap={24} align="center" justify="center">
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
          <ContactLink href={`mailto:${TEAM_EMAIL}`}>
            팀 문의: {TEAM_EMAIL}
          </ContactLink>
          <Copyright>© 2026 BOMBOM. ALL RIGHTS RESERVED.</Copyright>
        </Flex>
      </FooterWrapper>
    </Container>
  );
};

export default BomBomFooter;

const Container = styled.footer<{ device: Device }>`
  width: 100%;
  margin-top: 80px;
  padding: ${({ device }) => {
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
  gap: 0;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const LogoText = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  line-height: 1.75;
`;

const PolicyLinkWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PolicyLink = styled.a`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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

const ContactLink = styled.a`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Copyright = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  letter-spacing: 0.0625rem;
`;
