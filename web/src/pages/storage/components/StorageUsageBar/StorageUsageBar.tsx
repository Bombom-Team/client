import styled from '@emotion/styled';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef';
import useKeydownEscape from '@/hooks/useKeydownEscape';
import { calculateRate } from '@/utils/math';
import type { PointerEvent } from 'react';
import HelpIcon from '#/assets/svg/help.svg';

const TOOLTIP_ID = 'storage-usage-guide';
const CLOSE_DELAY_MS = 150;

interface StorageUsageBarProps {
  cur: number;
  max: number;
}

const StorageUsageBar = ({ cur, max }: StorageUsageBarProps) => {
  const [isGuideOpened, setIsGuideOpened] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const rate = calculateRate(cur, max);

  const closeTimerRef = useRef<number | null>(null);

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current === null) return;
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const openGuide = () => {
    cancelScheduledClose();
    setIsGuideOpened(true);
  };

  const closeGuide = useCallback(() => {
    cancelScheduledClose();
    setIsGuideOpened(false);
  }, [cancelScheduledClose]);

  // 아이콘에서 안내로 마우스를 옮기는 동안 닫히지 않도록 닫기를 잠깐 미룬다
  const scheduleClose = () => {
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(closeGuide, CLOSE_DELAY_MS);
  };

  useEffect(() => cancelScheduledClose, [cancelScheduledClose]);

  const containerRef = useClickOutsideRef<HTMLDivElement>(
    isGuideOpened ? closeGuide : null,
  );
  useKeydownEscape(isGuideOpened ? closeGuide : null);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') openGuide();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') scheduleClose();
  };

  const handleGuidePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') cancelScheduledClose();
  };

  return (
    <Container ref={containerRef}>
      <BarWrapper>
        <ProgressBar
          rate={rate}
          caption={`보관함 사용량 ${cur} / ${max}`}
          variant="rounded"
        />
      </BarWrapper>
      <HelpButton
        ref={helpButtonRef}
        type="button"
        aria-label="보관함 사용량 안내"
        aria-describedby={isGuideOpened ? TOOLTIP_ID : undefined}
        onClick={openGuide}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={openGuide}
        onBlur={closeGuide}
      >
        <HelpIconImage aria-hidden />
      </HelpButton>
      <Tooltip
        id={TOOLTIP_ID}
        opened={isGuideOpened}
        placement="bottom-left"
        anchorRef={helpButtonRef}
        onPointerEnter={handleGuidePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <GuideTitle>보관함 사용량이란?</GuideTitle>
        <GuideList>
          <GuideItem>
            {`아티클이 ${max}개를 넘으면, 매일 새벽\u00A03시에 오래된 아티클부터 자동으로 삭제돼요.`}
          </GuideItem>
          <GuideItem>
            {`${max}개가 넘어도 새 뉴스레터는 빠짐없이 받아요.`}
          </GuideItem>
          <GuideItem>
            {`북마크한 아티클은 ${max}개에 포함되지 않고, 삭제되지도 않아요.`}
          </GuideItem>
          <GuideItem>삭제된 아티클은 다시 볼 수 없어요.</GuideItem>
        </GuideList>
      </Tooltip>
    </Container>
  );
};

export default StorageUsageBar;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 4px;
  align-items: flex-end;
`;

// 사용량 문구보다 좁아지면 문구가 바 밖으로 넘쳐 아이콘과 겹친다
const BarWrapper = styled.div`
  flex-shrink: 0;
`;

// 문구 글꼴(theme.fonts.t3Regular: 0.75rem/1rem)에 맞춰 아이콘은 글자 크기, 높이는 줄 높이로 둔다.
// 글자 크기가 바뀌어도 아이콘이 함께 커지고 문구 줄 가운데에 온다.
const HelpButton = styled.button`
  position: relative;
  width: 0.75rem;
  height: 1rem;
  padding: 0;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};

  cursor: help;

  /* 아이콘 크기는 그대로 두고 손가락으로 누르는 영역만 32px로 넓힌다 */
  &::before {
    position: absolute;

    content: '';
    inset: -8px;
  }
`;

// SVG 파일의 크기가 100%라서, 크기를 직접 정하지 않으면 iOS(WebKit)에서 폭이 0이 되어 보이지 않는다
const HelpIconImage = styled(HelpIcon)`
  width: 0.75rem;
  height: 0.75rem;

  flex-shrink: 0;
`;

const GuideTitle = styled.p`
  margin-bottom: 4px;
  font: ${({ theme }) => theme.fonts.t3Bold};
`;

/* 어절 단위로 줄을 바꾼 뒤 오른쪽 여백이 남지 않도록, 가장 긴 줄(약 224px)에 여유 8px과 왼쪽 들여쓰기 16px을 더한 너비 */
const GuideList = styled.ul`
  width: 248px;
  padding-left: 16px;

  display: flex;
  gap: 4px;
  flex-direction: column;

  list-style: disc;
  word-break: keep-all;
`;

const GuideItem = styled.li``;
