import { theme } from '@bombom/shared';
import { ChevronIcon, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useRef } from 'react';
import { useElementHeight } from '../hooks/useElementHeight';
import { useKeyboardInset } from '../hooks/useKeyboardInset';
import { MOBILE_HORIZONTAL_PADDING } from '@/components/PageLayout/PageLayout.constants';
import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import ClockIcon from '#/assets/svg/clock.svg';

interface KeyboardInsetStyle extends CSSProperties {
  '--keyboard-inset'?: string;
}

interface InquiryChatLayoutProps {
  header?: ReactNode;
  footer: ReactNode;
}

/**
 * 채팅방과 아직 생성되기 전의 새 문의 화면이 함께 쓰는 채팅 화면 틀이다.
 * footer에는 입력창처럼 화면 아래에 두는 요소를 넘긴다.
 */
const InquiryChatLayout = ({
  header,
  footer,
  children,
}: PropsWithChildren<InquiryChatLayoutProps>) => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  // 휴대폰은 페이지 전체가 스크롤되어 메시지가 적으면 입력창이 화면 중간에 뜨므로 하단에 고정한다.
  // tablet은 사이트 푸터(BomBomFooter)가 함께 렌더되어 고정 입력창이 사이트 푸터를 가리므로 고정하지 않는다.
  const isFooterFixed = device === 'mobile';
  const footerRef = useRef<HTMLDivElement>(null);
  const footerHeight = useElementHeight({
    elementRef: footerRef,
    enabled: isFooterFixed,
  });
  const keyboardInset = useKeyboardInset({ enabled: isFooterFixed });
  // 키보드가 열릴 때마다 값이 바뀌므로 styled prop 대신 CSS 변수로 넘겨 class가 계속 새로 생기지 않게 한다.
  const keyboardInsetStyle: KeyboardInsetStyle = {
    '--keyboard-inset': `${keyboardInset}px`,
  };

  return (
    <Container
      isMobile={isMobile}
      style={isFooterFixed ? keyboardInsetStyle : undefined}
    >
      <Header isMobile={isMobile}>
        {isMobile && (
          <BackLink to="/support/inquiry">
            <ChevronIcon direction="left" width={20} height={20} />
            목록으로
          </BackLink>
        )}

        {header && <HeaderRow>{header}</HeaderRow>}

        <ResponseTimeNotice>
          {/* clock.svg는 stroke 색이 하드코딩되어 있어 color 대신 stroke로 덮어쓴다 */}
          <ClockIcon
            width={16}
            height={16}
            stroke={theme.colors.textTertiary}
          />
          평일 10:00-18:00 운영, 보통 1영업일 안에 답변드려요
        </ResponseTimeNotice>
      </Header>

      {children}

      {/* 고정한 입력창에 마지막 메시지가 가려지지 않도록 입력창 높이만큼 자리를 둔다.
          키보드가 열려 입력창이 하단 내비보다 위로 올라가면 올라간 만큼 자리를 더 둔다. */}
      {isFooterFixed && <FooterSpacer height={footerHeight} />}
      <FooterDock ref={footerRef} isFixed={isFooterFixed}>
        {footer}
      </FooterDock>
    </Container>
  );
};

export default InquiryChatLayout;

const Container = styled.div<{ isMobile: boolean }>`

  /* 모바일에서는 헤더가 페이지를 기준으로 sticky 해야 하므로 overflow를 만들지 않는다 */
  overflow: ${({ isMobile }) => (isMobile ? 'visible' : 'hidden')};
  position: relative;
  width: 100%;
  height: ${({ isMobile }) => (isMobile ? 'auto' : '100%')};
  max-width: ${({ isMobile }) => (isMobile ? '800px' : 'none')};
  margin: 0 auto;
  padding: ${({ isMobile }) => (isMobile ? '0' : '0 20px')};

  display: flex;
  flex-direction: column;

  box-sizing: border-box;
`;

const Header = styled.div<{ isMobile: boolean }>`
  position: ${({ isMobile }) => (isMobile ? 'sticky' : 'static')};
  top: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top})`
      : `calc(${theme.heights.headerPC} + 40px)`};
  z-index: ${({ theme }) => theme.zIndex.panel};
  padding: 16px 0 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  gap: 2px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const BackLink = styled(Link)`
  margin-bottom: 8px;

  display: flex;
  gap: 2px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  text-decoration: none;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const ResponseTimeNotice = styled.p`
  margin-top: 4px;

  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const FooterSpacer = styled.div<{ height: number }>`
  height: ${({ height, theme }) =>
    `calc(${height}px + max(0px, var(--keyboard-inset, 0px) - (${theme.heights.bottomNav} + ${theme.safeArea.bottom})))`};
  flex-shrink: 0;
`;

/**
 * 좌우 폭은 페이지 레이아웃 여백과 채팅 화면 최대 폭에 맞춰, 고정하지 않을 때와 입력창 폭이 같게 한다.
 */
const FooterDock = styled.div<{ isFixed: boolean }>`
  ${({ isFixed, theme }) =>
    isFixed &&
    `
      position: fixed;
      right: 0;
      /* 키보드가 열리면 하단 내비는 키보드 뒤로 가려지므로 키보드 바로 위에 둔다 */
      bottom: max(
        var(--keyboard-inset, 0px),
        calc(${theme.heights.bottomNav} + ${theme.safeArea.bottom})
      );
      left: 0;
      z-index: ${theme.zIndex.panel};
      max-width: calc(800px + ${MOBILE_HORIZONTAL_PADDING * 2}px);
      margin: 0 auto;
      padding: 0 ${MOBILE_HORIZONTAL_PADDING}px;

      background-color: ${theme.colors.white};
    `}
`;
