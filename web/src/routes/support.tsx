import styled from '@emotion/styled';
import {
  createFileRoute,
  Outlet,
  useMatches,
  useNavigate,
} from '@tanstack/react-router';
import BomBomFooter from '@/components/Footer/BomBomFooter';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import PCHeader from '@/components/Header/PCHeader';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice } from '@/hooks/useDevice';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';

type SupportTab = 'FAQ' | 'INQUIRY';

export const Route = createFileRoute('/support')({
  component: SupportLayout,
});

function SupportLayout() {
  useWebViewRegisterToken();

  const device = useDevice();
  const isMobile = device !== 'pc';
  const navigate = useNavigate();
  const matches = useMatches();
  const isInquiryTabActive = matches.some((match) =>
    match.routeId.startsWith('/support/inquiry'),
  );
  const activeTab: SupportTab = isInquiryTabActive ? 'INQUIRY' : 'FAQ';

  const handleTabSelect = (tab: SupportTab) => {
    if (tab === activeTab) return;
    navigate({ to: tab === 'FAQ' ? '/support' : '/support/inquiry' });
  };

  return (
    <>
      {device === 'pc' ? <PCHeader activeNav={null} /> : <MobileMainHeader />}

      <Container isMobile={isMobile}>
        <Title>고객센터</Title>

        <Tabs>
          <Tab
            value="FAQ"
            label="FAQ"
            selected={activeTab === 'FAQ'}
            onTabSelect={handleTabSelect}
          />
          <Tab
            value="INQUIRY"
            label="1:1 문의하기"
            selected={activeTab === 'INQUIRY'}
            onTabSelect={handleTabSelect}
          />
        </Tabs>

        <Outlet />
      </Container>

      <BomBomFooter />
    </>
  );
}

const Container = styled.main<{ isMobile: boolean }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 24px) 16px 24px`
      : `calc(${theme.heights.headerPC} + 40px + 24px) 16px 24px`};

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;
