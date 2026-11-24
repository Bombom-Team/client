import { theme } from '@bombom/shared';
import { ChevronIcon, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import type { PropsWithChildren, ReactNode } from 'react';
import ClockIcon from '#/assets/svg/clock.svg';

interface InquiryChatLayoutProps {
  header?: ReactNode;
}

/**
 * 채팅방과 아직 생성되기 전의 새 문의 화면이 함께 쓰는 채팅 화면 틀이다.
 */
const InquiryChatLayout = ({
  header,
  children,
}: PropsWithChildren<InquiryChatLayoutProps>) => {
  const device = useDevice();
  const isMobile = device !== 'pc';

  return (
    <Container isMobile={isMobile}>
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
