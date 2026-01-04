import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice } from '@/hooks/useDevice';
import ChallengeGuideModal from '@/pages/challenge/index/components/ChallengeGuideModal/ChallengeGuideModal';
import { useChallengeDetailTabs } from '@/pages/challenge/index/hooks/useChallengeDetailTabs';
import type { Device } from '@/hooks/useDevice';
import type { CSSObject, Theme } from '@emotion/react';
import TrophyIcon from '#/assets/svg/trophy.svg';

export const Route = createFileRoute('/_bombom/_main/challenge/$challengeId')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 상세',
      },
    ],
  }),
  component: ChallengeDetail,
});

function ChallengeDetail() {
  const { challengeId } = Route.useParams();
  const device = useDevice();

  const { tabs, activeTabId, goToTab } = useChallengeDetailTabs({
    challengeId,
  });

  return (
    <>
      <Container>
        {device !== 'mobile' && (
          <TitleWrapper>
            <TitleIconBox>
              <TrophyIcon width={20} height={20} color={theme.colors.white} />
            </TitleIconBox>
            <Title>챌린지</Title>
          </TitleWrapper>
        )}

        <ContentWrapper device={device}>
          <TabsWrapper device={device}>
            <Tabs direction={device === 'mobile' ? 'horizontal' : 'vertical'}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={tab.label}
                  onTabSelect={() => goToTab(tab.path)}
                  selected={activeTabId === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  textAlign="start"
                />
              ))}
            </Tabs>
          </TabsWrapper>

          <TabPanel>
            <Outlet />
          </TabPanel>
        </ContentWrapper>
      </Container>
      <ChallengeGuideModal challengeId={Number(challengeId)} />
    </>
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

  background-color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.heading3};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
  align-items: flex-start;
  align-self: stretch;
`;

const TabsWrapper = styled.div<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '100%' : '220px')};

  display: flex;
  flex-direction: column;

  box-sizing: border-box;

  order: 0;

  ${({ device, theme }) => tabsWrapperStyles[device](theme)}
`;

const tabsWrapperStyles: Record<Device, (theme: Theme) => CSSObject> = {
  pc: (theme) => ({
    flexShrink: 0,
    border: `1px solid ${theme.colors.stroke}`,
    borderRadius: '12px',
    padding: '16px',
  }),
  tablet: (theme) => ({
    flexShrink: 0,
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
`;
