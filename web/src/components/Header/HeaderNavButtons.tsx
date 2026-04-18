import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import type { Device } from '@/hooks/useDevice';
import type { Nav } from '@/types/nav';
import CompassIcon from '#/assets/svg/compass.svg';
import MailIcon from '#/assets/svg/mail.svg';
import PenIcon from '#/assets/svg/pen.svg';
import StorageIcon from '#/assets/svg/storage.svg';
import ChallengeIcon from '#/assets/svg/trophy.svg';

const NAV_LABEL = {
  today: '투데이',
  storage: '보관함',
  challenge: '챌린지',
  blog: '블로그',
  recommend: '둘러보기',
} as const;

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
        <MailIcon
          width={24}
          height={24}
          color={activeNav === 'today' ? 'white' : 'black'}
        />
        <p>{NAV_LABEL.today}</p>
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
        <p>{NAV_LABEL.storage}</p>
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
        <p>{NAV_LABEL.challenge}</p>
      </NavButton>
      {isPC && (
        <NavButton
          active={activeNav === 'blog'}
          isPC={isPC}
          to="/blog"
          className="nav-link"
        >
          <PenIcon
            width={20}
            height={20}
            color={activeNav === 'blog' ? 'white' : 'black'}
          />
          <BlogLabel>
            <p>{NAV_LABEL.blog}</p>
            <BetaBadge active={activeNav === 'blog'}>Beta</BetaBadge>
          </BlogLabel>
        </NavButton>
      )}
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
        <p>{NAV_LABEL.recommend}</p>
      </NavButton>
    </>
  );
};

export default HeaderNavButtons;

const BlogLabel = styled.div`
  position: relative;

  display: flex;
  align-items: center;
`;

const BetaBadge = styled.span<{ active?: boolean }>`
  position: absolute;
  top: -12px;
  right: -12px;
  padding: 2px 4px;

  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.t1Regular};
  font-weight: 700;
`;

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
  font: ${({ isPC, theme }) => (isPC ? theme.fonts.t5Regular : theme.fonts.t1Regular)};

  text-shadow: ${({ active }) =>
    active ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.dividers};
    transform: translateY(-1px);
  }
`;
