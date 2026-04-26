import { useEffect } from 'react';
import { MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID } from '../constants/maeilMail';
import type { RefObject } from 'react';

export const useMaeilMailAnswerButton = (
  contentRef: RefObject<HTMLDivElement | null>,
  onClick: () => void,
) => {
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const handleClick = (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest(
        `#${MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID}`,
      );
      if (!button) return;
      e.preventDefault();
      onClick();
    };

    contentEl.addEventListener('click', handleClick);
    return () => contentEl.removeEventListener('click', handleClick);
  }, [contentRef, onClick]);
};
