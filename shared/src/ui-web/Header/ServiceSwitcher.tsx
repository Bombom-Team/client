import type { ReactNode } from 'react';
import styled from '@emotion/styled';

const BOMBOM_URL = 'https://www.bombom.news';
const MAEIL_MAIL_URL = 'https://maeilmail.bombom.news';

export interface ServiceSwitcherProps {
  activeService: 'bombom' | 'maeil-mail';
  bombomLogo: ReactNode;
  maeilmailLogo: ReactNode;
}

const ServiceSwitcher = ({
  activeService,
  bombomLogo,
  maeilmailLogo,
}: ServiceSwitcherProps) => {
  return (
    <Container>
      <Inner>
        <ServiceLink href={BOMBOM_URL} isActive={activeService === 'bombom'}>
          {bombomLogo}
        </ServiceLink>
        <Divider />
        <ServiceLink
          href={MAEIL_MAIL_URL}
          isActive={activeService === 'maeil-mail'}
        >
          {maeilmailLogo}
        </ServiceLink>
      </Inner>
    </Container>
  );
};

export default ServiceSwitcher;

const Container = styled.div`
  width: 100%;
  height: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 0 4px;

  display: flex;
  gap: 12px;
  align-items: center;
`;

const ServiceLink = styled.a<{ isActive: boolean }>`
  display: flex;
  align-items: center;

  opacity: ${({ isActive }) => (isActive ? 1 : 0.7)};
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
`;

const Divider = styled.span`
  width: 1px;
  height: 12px;

  background: ${({ theme }) => theme.colors.stroke};
`;
