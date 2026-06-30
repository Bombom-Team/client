import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip/Tooltip';
import ShieldOutlineIcon from '#/assets/svg/shield-outline.svg';
import ShieldIcon from '#/assets/svg/shield.svg';

interface StreakShieldInfoProps {
  status?: 'AVAILABLE' | 'USED';
}

const StreakShieldInfo = ({ status }: StreakShieldInfoProps) => {
  const [tooltipOpened, setTooltipOpened] = useState(false);
  const shieldRef = useRef<HTMLDivElement>(null);
  const isUsed = status === 'USED';
  const tooltipText = isUsed
    ? '연속 읽기 보호막 (월 1회 제공) - 사용 완료'
    : '연속 읽기 보호막 (월 1회 제공)';

  const openTooltip = () => setTooltipOpened(true);
  const closeTooltip = () => setTooltipOpened(false);

  return (
    <Container
      tabIndex={0}
      ref={shieldRef}
      aria-label={tooltipText}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onFocus={openTooltip}
      onBlur={closeTooltip}
    >
      {isUsed ? <ShieldOutlineIcon aria-hidden /> : <ShieldIcon aria-hidden />}
      <Tooltip opened={tooltipOpened} placement="top" anchorRef={shieldRef}>
        {tooltipText}
      </Tooltip>
    </Container>
  );
};

export default StreakShieldInfo;

const Container = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.base};
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
`;
