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
        icon={
          <FloatingMenuIcon viewBox="0 0 28 28" fill={theme.colors.white} />
        }
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
          <StyledMenuIcon viewBox="0 0 28 28" />
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
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 20px;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
`;

const QuickMenuIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const StyledMenuIcon = styled(MenuIcon)`
  width: 16px;
  height: 16px;

  display: block;

  color: ${({ theme }) => theme.colors.white};
`;

const FloatingMenuIcon = styled(MenuIcon)`
  width: 24px;
  height: 24px;

  display: block;
`;

const Title = styled.h3`
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const StyledIcon = styled.div<{ device: Device; selected?: boolean }>`
  width: ${({ device }) => (device === 'pc' ? '24px' : '28px')};
  height: ${({ device }) => (device === 'pc' ? '24px' : '28px')};

  color: ${({ theme, selected = false }) =>
    selected ? theme.colors.white : theme.colors.primaryBomBom};
`;

const StyledTab = styled(Tab)`
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
