import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { LEAVE_MESSAGES } from '../constants/exam';
import { FADE_IN } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { LeaveReason } from '../types/literacyQuiz';

type ShieldSize = 'mobile' | 'pc';

interface ExamShieldProps {
  reason: LeaveReason;
  leaveCount: number;
  size: ShieldSize;
  onContinue: () => void;
}

// 화면을 벗어나면 시험지를 흐리게 가린다. 타이머는 계속 흐른다.
const ExamShield = ({
  reason,
  leaveCount,
  size,
  onContinue,
}: ExamShieldProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  return (
    <Container
      size={size}
      role="dialog"
      aria-modal="true"
      aria-label="시험지를 가렸어요"
      data-exam-shield
    >
      <Title size={size}>시험지를 가렸어요</Title>
      <Message size={size}>
        {LEAVE_MESSAGES[reason]}
        <br />
        타이머는 계속 흘러가요.
      </Message>
      <LeaveCount size={size}>화면 벗어남 {leaveCount}회</LeaveCount>
      <ContinueButton
        ref={buttonRef}
        type="button"
        size={size}
        onClick={onContinue}
        data-keep-enter
      >
        계속 풀기
      </ContinueButton>
    </Container>
  );
};

export default ExamShield;

const SIZE_STYLES = {
  mobile: {
    gap: '3.4cqw',
    padding: '10cqw',
    title: '7cqw',
    message: 'max(13px, 3.6cqw)',
    count: '3.2cqw',
    countPadding: '1cqw 3cqw',
    buttonMargin: '2cqw',
    buttonPadding: '3.4cqw 9cqw',
    button: 'max(14px, 4cqw)',
  },
  pc: {
    gap: '14px',
    padding: '40px',
    title: '32px',
    message: '16px',
    count: '14px',
    countPadding: '4px 12px',
    buttonMargin: '8px',
    buttonPadding: '14px 40px',
    button: '16px',
  },
};

const Container = styled.div<{ size: ShieldSize }>`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.floating};
  padding: ${({ size }) => SIZE_STYLES[size].padding};

  display: grid;
  gap: ${({ size }) => SIZE_STYLES[size].gap};
  align-content: center;

  background: rgb(250 248 243 / 78%);
  font-family: ${LITERACY_FONTS.head};
  text-align: center;

  animation: ${FADE_IN} 0.2s both;

  backdrop-filter: blur(14px);
  inset: 0;
  place-items: center;
`;

const Title = styled.b<{ size: ShieldSize }>`
  color: ${LITERACY_COLORS.ink};
  font: 400 ${({ size }) => SIZE_STYLES[size].title} / 1.3
    ${LITERACY_FONTS.display};
`;

const Message = styled.p<{ size: ShieldSize }>`
  margin: 0;

  color: ${LITERACY_COLORS.subDeep};
  font: 600 ${({ size }) => SIZE_STYLES[size].message} / 1.6
    ${LITERACY_FONTS.head};

  word-break: keep-all;
`;

const LeaveCount = styled.span<{ size: ShieldSize }>`
  padding: ${({ size }) => SIZE_STYLES[size].countPadding};
  border: 1.5px solid ${LITERACY_COLORS.stamp};

  color: ${LITERACY_COLORS.stamp};
  font: 700 ${({ size }) => SIZE_STYLES[size].count} ${LITERACY_FONTS.head};
`;

const ContinueButton = styled.button<{ size: ShieldSize }>`
  margin-top: ${({ size }) => SIZE_STYLES[size].buttonMargin};
  padding: ${({ size }) => SIZE_STYLES[size].buttonPadding};
  border: 0;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 700 ${({ size }) => SIZE_STYLES[size].button} ${LITERACY_FONTS.head};

  cursor: pointer;
`;
