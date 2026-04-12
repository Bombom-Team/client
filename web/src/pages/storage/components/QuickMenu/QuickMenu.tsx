import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { MENU_ITEMS } from './QuickMenu.constants';
import FloatingActionButton from '@/components/FloatingActionButton/FloatingActionButton';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import MenuIcon from '#/assets/svg/menu.svg';

const QuickMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const device = useDevice();

  const handleTabSelect = (path: string) => {
    navigate({ to: path });
  };

  if (device !== 'pc') {
    return (
      <FloatingActionButton
        icon={<MenuIcon width={24} height={30} fill={theme.colors.white} />}
      >
        <Tabs direction="vertical">
          {MENU_ITEMS.map(({ key, label, path, Icon }) => {
            const isSelected = location.pathname.startsWith(path);

            return (
              <StyledTab
                key={key}
                value={key}
                label={label}
                selected={isSelected}
                onTabSelect={() => handleTabSelect(path)}
                StartComponent={
                  <StyledIcon as={Icon} selected={isSelected} device={device} />
                }
                textAlign="start"
                device={device}
              />
            );
          })}
        </Tabs>
      </FloatingActionButton>
    );
  }

  return (
    <Container>
      <TitleWrapper>
        <QuickMenuIconWrapper>
          <StyledMenuIcon />
        </QuickMenuIconWrapper>
        <Title>바로 가기</Title>
      </TitleWrapper>
      <Tabs direction="vertical">
        {MENU_ITEMS.map(({ key, label, path, Icon }) => {
          const isSelected = location.pathname.startsWith(path);

          return (
            <StyledTab
              key={key}
              value={key}
              label={label}
              selected={isSelected}
              onTabSelect={() => handleTabSelect(path)}
              StartComponent={
                <StyledIcon as={Icon} selected={isSelected} device={device} />
              }
              textAlign="start"
              device={device}
            />
          );
        })}
      </Tabs>
    </Container>
  );
};

export default QuickMenu;

const Container = styled.nav`
  width: 100%;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 1.25rem;

  display: flex;
  gap: 1.25rem;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: flex-start;
`;

const QuickMenuIconWrapper = styled.div`
  padding: 0.5rem;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const StyledMenuIcon = styled(MenuIcon)`
  width: 1rem;
  height: 1rem;

  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h3`
  font: ${({ theme }) => theme.fonts.heading5};
`;

const StyledIcon = styled.div<{ device: Device; selected?: boolean }>`
  width: ${({ device }) => (device === 'pc' ? '1.5rem' : '1.75rem')};
  height: ${({ device }) => (device === 'pc' ? '1.5rem' : '1.75rem')};

  color: ${({ theme, selected = false }) =>
    selected ? theme.colors.white : theme.colors.primary};
`;

const StyledTab = styled(Tab)<{ device: Device }>`
  font: ${({ theme, device }) =>
    device === 'pc' ? theme.fonts.body2 : theme.fonts.body1};
`;
