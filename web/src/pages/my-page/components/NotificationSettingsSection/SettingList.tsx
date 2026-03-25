import styled from '@emotion/styled';
import { CATEGORY } from '../../constants/notification';
import type { Category, NotificationSetting } from '../../types/notification';
import type { UseQueryResult } from '@tanstack/react-query';

export const NOTIFICATION_SETTINGS = [
  {
    category: CATEGORY.article,
    label: '아티클 알림',
    hint: '새로운 아티클 도착 알림',
  },
  {
    category: CATEGORY.event,
    label: '이벤트 알림',
    hint: '이벤트 및 프로모션 알림',
  },
  {
    category: CATEGORY.challengeStart,
    label: '챌린지 시작 알림',
    hint: '챌린지 시작일 알림',
  },
  {
    category: CATEGORY.challengeTodoReminder,
    label: '챌린지 리마인드 알림',
    hint: '오늘의 챌린지 목표 리마인드 알림',
  },
] as const;

interface SettingListProps {
  hasPermission: boolean;
  notificationsEnabled: UseQueryResult<NotificationSetting>[];
  onToggle: (category: Category, currentEnabled: boolean) => void;
}

const SettingList = ({
  hasPermission,
  notificationsEnabled,
  onToggle,
}: SettingListProps) => {
  const settings = NOTIFICATION_SETTINGS.map((config, index) => ({
    category: config.category,
    label: config.label,
    hint: config.hint,
    enabled: notificationsEnabled[index]?.data?.enabled ?? false,
  }));

  return (
    <Container hasPermission={hasPermission}>
      {settings.map((setting) => (
        <SettingRow key={setting.category}>
          <SettingInfo>
            <SettingLabel>{setting.label}</SettingLabel>
            <SettingHint>{setting.hint}</SettingHint>
          </SettingInfo>
          <ToggleButton
            type="button"
            disabled={!hasPermission}
            onClick={() => onToggle(setting.category, setting.enabled)}
          >
            <ToggleTrack enabled={setting.enabled}>
              <ToggleThumb enabled={setting.enabled} />
            </ToggleTrack>
          </ToggleButton>
        </SettingRow>
      ))}
    </Container>
  );
};

export default SettingList;

const Container = styled.div<{ hasPermission: boolean }>`
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  opacity: ${({ hasPermission }) => (hasPermission ? 1 : 0.6)};
`;

const SettingRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.dividers};
  }
`;

const SettingInfo = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const SettingLabel = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const SettingHint = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const ToggleButton = styled.button<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: opacity 0.2s;
`;

const ToggleTrack = styled.div<{ enabled: boolean }>`
  position: relative;
  width: 51px;
  height: 31px;
  border-radius: 16px;

  background-color: ${({ theme, enabled }) =>
    enabled ? theme.colors.primary : theme.colors.disabledText};

  transition: background-color 0.3s;
`;

const ToggleThumb = styled.div<{ enabled: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);

  background-color: ${({ theme }) => theme.colors.white};

  transform: translateX(${({ enabled }) => (enabled ? '20px' : '0')});
  transition: transform 0.3s;
`;
