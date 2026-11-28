import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BLOCKED_SHORTCUT_KEYS,
  NOTICE_DURATION_MS,
  PRINT_SCREEN_CLIPBOARD_TEXT,
} from '../constants/exam';
import type { LeaveReason } from '../types/literacyQuiz';
import type { RefObject } from 'react';

const BLOCKED_EVENTS = [
  'copy',
  'cut',
  'contextmenu',
  'dragstart',
  'selectstart',
] as const;

const NOTICE_EVENTS: string[] = ['copy', 'cut', 'contextmenu'];

const COPY_BLOCKED_MESSAGE = '시험지는 복사할 수 없어요';
const PRINT_BLOCKED_MESSAGE = '시험지는 인쇄할 수 없어요';

// 캡처 키를 누르면 클립보드를 안내 문구로 덮어쓴다. 실패해도 가림막만으로 충분하다.
const overwriteClipboard = async () => {
  try {
    await navigator.clipboard?.writeText(PRINT_SCREEN_CLIPBOARD_TEXT);
  } catch {
    // noop
  }
};

interface UseExamProtectionParams {
  isEnabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onLeave?: (reason: LeaveReason, leaveCount: number) => void;
}

// 풀이 중 시험지 복사·인쇄를 막고, 화면을 벗어나면 시험지를 가린다. 타이머는 계속 흐른다.
export const useExamProtection = ({
  isEnabled,
  containerRef,
  onLeave,
}: UseExamProtectionParams) => {
  const [leaveCount, setLeaveCount] = useState(0);
  const [shieldReason, setShieldReason] = useState<LeaveReason | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const leaveCountRef = useRef(0);
  const onLeaveRef = useRef(onLeave);

  useEffect(() => {
    onLeaveRef.current = onLeave;
  }, [onLeave]);

  useEffect(() => {
    if (!noticeMessage) return;
    const timerId = setTimeout(
      () => setNoticeMessage(null),
      NOTICE_DURATION_MS,
    );
    return () => clearTimeout(timerId);
  }, [noticeMessage]);

  const leave = useCallback((reason: LeaveReason) => {
    leaveCountRef.current += 1;
    setLeaveCount(leaveCountRef.current);
    setShieldReason(reason);
    onLeaveRef.current?.(reason, leaveCountRef.current);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!isEnabled || !container) return;

    const handleBlockedEvent = (event: Event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-exam-shield]')) {
        return;
      }
      event.preventDefault();
      if (NOTICE_EVENTS.includes(event.type)) {
        setNoticeMessage(COPY_BLOCKED_MESSAGE);
      }
    };

    BLOCKED_EVENTS.forEach((type) =>
      container.addEventListener(type, handleBlockedEvent),
    );
    return () => {
      BLOCKED_EVENTS.forEach((type) =>
        container.removeEventListener(type, handleBlockedEvent),
      );
    };
  }, [containerRef, isEnabled]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeydown = (event: KeyboardEvent) => {
      const key = (event.key || '').toLowerCase();
      if (!(event.ctrlKey || event.metaKey)) return;
      if (!BLOCKED_SHORTCUT_KEYS.includes(key)) return;

      event.preventDefault();
      setNoticeMessage(
        key === 'p' ? PRINT_BLOCKED_MESSAGE : COPY_BLOCKED_MESSAGE,
      );
    };

    const handleKeyup = (event: KeyboardEvent) => {
      if (event.key !== 'PrintScreen') return;
      overwriteClipboard();
      leave('printscreen');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) leave('hidden');
    };

    const handleBlur = () => {
      if (!document.hidden) leave('blur');
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isEnabled, leave]);

  const dismissShield = useCallback(() => setShieldReason(null), []);

  return useMemo(
    () => ({ leaveCount, shieldReason, noticeMessage, dismissShield }),
    [leaveCount, shieldReason, noticeMessage, dismissShield],
  );
};
