import { theme } from '@bombom/shared';
import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { queries } from '@/apis/queries';
import ChatBubbleDotsIcon from '#/assets/svg/chat-bubble-dots.svg';
import CloseIcon from '#/assets/svg/close.svg';

const BUTTON_LABEL = '1:1 채팅 문의';
const UNREAD_LABEL = '1:1 채팅 문의 (읽지 않은 문의 있음)';
const UNREAD_NOTICE = '문의 답변이 도착했어요!';
const NOTICE_DURATION = 5000;

/**
 * PC에서 어느 화면에 있든 문의로 바로 들어갈 수 있도록 띄우는 버튼이다.
 * 모바일은 하단 네비게이션과 겹치고 헤더 진입점이 이미 가까워 노출하지 않는다.
 */
const InquiryFloatingButton = () => {
  const device = useDevice();
  const matchRoute = useMatchRoute();
  const { data: unreadStatus } = useQuery(queries.inquiryUnreadStatus());
  const isOnSupportPage = Boolean(matchRoute({ to: '/support', fuzzy: true }));
  const isVisible = device === 'pc' && !isOnSupportPage;
  const hasUnread = Boolean(unreadStatus?.hasUnread);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const hadUnreadRef = useRef(false);

  // 안읽음이 없다가 생긴 순간에만 안내해, 화면을 옮겨 다닐 때마다 말풍선이 다시 뜨지 않게 한다.
  // 버튼이 보이지 않는 화면에서는 안내를 건너뛰되 직전 상태는 갱신하지 않아, 돌아왔을 때 한 번 더 안내한다.
  useEffect(() => {
    if (!hasUnread) {
      hadUnreadRef.current = false;
      setIsNoticeOpen(false);
      return;
    }

    if (!isVisible || hadUnreadRef.current) return;

    hadUnreadRef.current = true;
    setIsNoticeOpen(true);
  }, [hasUnread, isVisible]);

  useEffect(() => {
    if (!isNoticeOpen) return;

    const timerId = setTimeout(() => setIsNoticeOpen(false), NOTICE_DURATION);

    return () => clearTimeout(timerId);
  }, [isNoticeOpen]);

  if (!isVisible) {
    return null;
  }

  const handleCloseNotice = () => {
    setIsNoticeOpen(false);
  };

  return createPortal(
    <Container>
      {isNoticeOpen && (
        <Notice role="status">
          <NoticeLink to="/support/inquiry">{UNREAD_NOTICE}</NoticeLink>
          <CloseButton
            type="button"
            aria-label="안내 닫기"
            onClick={handleCloseNotice}
          >
            <CloseIcon
              width={16}
              height={16}
              fill={theme.colors.textSecondary}
            />
          </CloseButton>
        </Notice>
      )}

      <FloatingLink
        to="/support/inquiry"
        aria-label={hasUnread ? UNREAD_LABEL : BUTTON_LABEL}
      >
        <ChatBubbleDotsIcon width={32} height={32} />
      </FloatingLink>
    </Container>,
    document.body,
  );
};

export default InquiryFloatingButton;

const Container = styled.div`
  position: fixed;
  right: 48px;
  bottom: 48px;
  z-index: ${({ theme }) => theme.zIndex.overlay};

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: flex-end;
`;

/**
 * 아래쪽 플로팅 버튼에서 나온 말풍선처럼 보이도록 오른쪽 아래에 꼬리를 붙인다.
 */
const Notice = styled.div`
  position: relative;
  padding: 12px 12px 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

  display: flex;
  gap: 8px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;

  &::after {
    position: absolute;
    right: 24px;
    bottom: -8px;
    border-top: 8px solid ${({ theme }) => theme.colors.white};
    border-right: 8px solid transparent;
    border-left: 8px solid transparent;

    content: '';
  }
`;

const NoticeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  line-height: 0;
`;

const FloatingLink = styled(Link)`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};

  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
