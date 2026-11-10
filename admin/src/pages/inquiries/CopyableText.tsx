import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';

const COPIED_LABEL_DURATION = 1200;

interface CopyableTextProps {
  // 화면에 보이는 값이자 복사할 값. 폭이 좁으면 말줄임되지만 복사는 전체가 된다.
  value: string;
  className?: string;
}

/**
 * 누르면 값을 클립보드에 복사하는 텍스트.
 *
 * 이메일·닉네임처럼 좁은 칸에서 잘리는 값은 드래그로 고르기 번거롭고 title 툴팁은
 * 복사가 되지 않는다. 눌러서 한 번에 복사할 수 있게 한다.
 */
export function CopyableText({ value, className }: CopyableTextProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async (event: React.MouseEvent) => {
    // 목록 카드 안에서도 쓰이므로 카드 선택까지 함께 일어나지 않게 막는다.
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      alert('복사하지 못했습니다. 주소창의 권한 설정을 확인해주세요.');
      return;
    }

    setIsCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setIsCopied(false),
      COPIED_LABEL_DURATION,
    );
  };

  return (
    <CopyButton
      type="button"
      className={className}
      title={`${value} (눌러서 복사)`}
      aria-label={`${value} 복사하기`}
      onClick={handleCopy}
    >
      <CopyValue>{value}</CopyValue>
      {isCopied && <CopiedBadge role="status">복사됨</CopiedBadge>}
    </CopyButton>
  );
}

const CopyButton = styled.button`
  min-width: 0;
  max-width: 100%;
  padding: 0;
  border: none;

  display: inline-flex;
  gap: 4px;
  align-items: baseline;

  background: none;
  color: inherit;
  font: inherit;
  text-align: left;

  cursor: pointer;

  &:hover > span:first-of-type {
    text-decoration: underline;
  }
`;

const CopyValue = styled.span`
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
`;

const CopiedBadge = styled.span`
  flex-shrink: 0;

  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;
