import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import LoginCard from '../pages/login/components/LoginCard';
import { useDevice } from '@/hooks/useDevice';
import { getResponsiveValue } from '@/utils/responsive';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, follow',
      },
      {
        title: '봄봄 | 로그인',
      },
    ],
  }),
  component: Login,
});

function Login() {
  const device = useDevice();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('error')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);

      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  }, []);

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <LoginCard />
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  min-height: 100vh;
  padding: ${({ device }) => getResponsiveValue(device, 16, 24, 32)};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${({ device }) => getResponsiveValue(device, 400, 520, 600)};

  display: flex;
  gap: ${({ device }) => getResponsiveValue(device, 20, 28, 32)};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
