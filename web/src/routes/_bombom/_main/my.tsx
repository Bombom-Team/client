import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import {
  createFileRoute,
  Outlet,
  useMatchRoute,
  useNavigate,
} from '@tanstack/react-router';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice } from '@/hooks/useDevice';
import ReadingCompanionCard from '@/pages/my-page/components/ReadingCompanionCard';
import { isWebView } from '@/utils/device';
import type { Device } from '@/hooks/useDevice';
import type { CSSObject, Theme } from '@emotion/react';
import AvatarIcon from '#/assets/svg/avatar.svg';

const DEFAULT_TABS = [
  { id: 'profile', label: '내 정보', to: '/my/profile' },
  { id: 'reading-activity', label: '읽기 활동', to: '/my/reading-activity' },
  { id: 'challenges', label: '나의 챌린지', to: '/my/challenges' },
  { id: 'newsletters', label: '구독 뉴스레터', to: '/my/newsletters' },
  { id: 'rewards', label: '선물함', to: '/my/rewards' },
] as const;

const WEBVIEW_TABS = [
  { id: 'notification', label: '알림 설정', to: '/my/notification' },
] as const;

type MyPageTabTo =
  | (typeof DEFAULT_TABS)[number]['to']
  | (typeof WEBVIEW_TABS)[number]['to'];

export const Route = createFileRoute('/_bombom/_main/my')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 마이페이지',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  }),
  component: MyPage,
});

function MyPage() {
  const device = useDevice();
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const tabs = isWebView()
    ? [...DEFAULT_TABS, ...WEBVIEW_TABS]
    : [...DEFAULT_TABS];

  const activeTabId =
    tabs.find((tab) => matchRoute({ to: tab.to }))?.id ?? 'profile';

  const handleTabSelect = (to: MyPageTabTo) => {
    navigate({ to, replace: true });
  };

  return (
    <Container>
      <TitleWrapper>
        <TitleIconBox>
          <AvatarIcon width={20} height={20} color={theme.colors.white} />
        </TitleIconBox>
        <Title>마이페이지</Title>
      </TitleWrapper>

      <ContentWrapper device={device}>
        <SideColumn device={device}>
          <TabsWrapper device={device}>
            <Tabs direction={device === 'mobile' ? 'horizontal' : 'vertical'}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  onTabSelect={() => handleTabSelect(tab.to)}
                  selected={activeTabId === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  textAlign="start"
                />
              ))}
            </Tabs>
          </TabsWrapper>
          {device !== 'mobile' && <ReadingCompanionCard />}
        </SideColumn>

        <TabPanel
          id={`panel-${activeTabId}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTabId}`}
        >
          <Outlet />
        </TabPanel>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: flex-start;

  box-sizing: border-box;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const TitleIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
  align-items: flex-start;
  align-self: stretch;
`;

const SideColumn = styled.div<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '100%' : '280px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '0' : '20px')};
  flex-direction: column;
  flex-shrink: 0;

  box-sizing: border-box;

  order: 0;
`;

const TabsWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  ${({ device, theme }) => tabsWrapperStyles[device](theme)}
`;

const tabsWrapperStyles: Record<Device, (theme: Theme) => CSSObject> = {
  pc: (theme) => ({
    border: `1px solid ${theme.colors.stroke}`,
    borderRadius: '12px',
    padding: '16px',
  }),
  tablet: (theme) => ({
    border: `1px solid ${theme.colors.stroke}`,
    borderRadius: '12px',
    padding: '16px',
  }),
  mobile: () => ({
    gap: '8px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
  }),
};

const TabPanel = styled.div`
  width: 100%;
  min-width: 0;

  flex: 1;

  animation: fadein 0.2s ease-in-out;

  order: 1;

  @keyframes fadein {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
