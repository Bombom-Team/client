import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import type { Device } from '@/hooks/useDevice';
import type { Nav } from '@/types/nav';
import CompassIcon from '#/assets/svg/compass.svg';
import HomeIcon from '#/assets/svg/home.svg';
import StorageIcon from '#/assets/svg/storage.svg';
import ChallengeIcon from '#/assets/svg/trophy.svg';

interface HeaderNavButtonsProps {
  activeNav: Nav;
  device: Device;
}

const HeaderNavButtons = ({ activeNav, device }: HeaderNavButtonsProps) => {
  const isPC = device === 'pc';

  return (
    <>
      <NavButton
        active={activeNav === 'today'}
        isPC={isPC}
        to="/today"
        className="nav-link"
      >
        <HomeIcon
          width={24}
          height={24}
          color={activeNav === 'today' ? 'white' : 'black'}
        />
        <p>오늘의 뉴스레터</p>
      </NavButton>
      <NavButton
        active={activeNav === 'storage'}
        isPC={isPC}
        to="/storage"
        className="nav-link"
      >
        <StorageIcon
          width={24}
          height={24}
          color={activeNav === 'storage' ? 'white' : 'black'}
        />
        <p>뉴스레터 보관함</p>
      </NavButton>
      <NavButton
        active={activeNav === 'challenge'}
        isPC={isPC}
        to="/challenge"
        className="nav-link"
      >
        <ChallengeIcon
          width={24}
          height={24}
          color={activeNav === 'challenge' ? 'white' : 'black'}
        />
        <p>챌린지</p>
      </NavButton>
      <NavButton
        active={activeNav === 'recommend'}
        isPC={isPC}
        to="/"
        className="nav-link"
      >
        <CompassIcon
          width={24}
          height={24}
          color={activeNav === 'recommend' ? 'white' : 'black'}
        />
        <p>뉴스레터 추천</p>
      </NavButton>
    </>
  );
};

export default HeaderNavButtons;

const NavButton = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'isPC',
})<{ active?: boolean; isPC: boolean }>`
  height: 100%;
  padding: ${({ isPC }) => (isPC ? '10px 12px' : '4px 12px')};
  border-radius: 12px;

  display: flex;
  gap: ${({ isPC }) => (isPC ? '4px' : '0')};
  flex: ${({ isPC }) => !isPC && '1'};
  flex-direction: ${({ isPC }) => (isPC ? 'row' : 'column')};
  align-items: center;
  justify-content: center;

  background: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ isPC, theme }) => (isPC ? theme.fonts.body2 : theme.fonts.body4)};

  text-shadow: ${({ active }) =>
    active ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.dividers};
    transform: translateY(-1px);
  }
`;
