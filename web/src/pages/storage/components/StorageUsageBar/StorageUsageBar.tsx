import styled from '@emotion/styled';
import { useCallback, useRef, useState } from 'react';
import ProgressBar from '../../../../components/ProgressBar/ProgressBar';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef';
import useKeydownEscape from '@/hooks/useKeydownEscape';
import { calculateRate } from '@/utils/math';
import type { PointerEvent } from 'react';
import HelpIcon from '#/assets/svg/help.svg';

const TOOLTIP_ID = 'storage-usage-guide';

interface StorageUsageBarProps {
  cur: number;
  max: number;
}

const StorageUsageBar = ({ cur, max }: StorageUsageBarProps) => {
  const [isGuideOpened, setIsGuideOpened] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const rate = calculateRate(cur, max);

  const openGuide = () => setIsGuideOpened(true);
  const closeGuide = useCallback(() => setIsGuideOpened(false), []);

  const containerRef = useClickOutsideRef<HTMLDivElement>(
    isGuideOpened ? closeGuide : null,
  );
  useKeydownEscape(isGuideOpened ? closeGuide : null);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') openGuide();
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') closeGuide();
  };

  return (
    <Container ref={containerRef}>
      <ProgressBar
        rate={rate}
        caption={`보관함 사용량 ${cur} / ${max}`}
        variant="rounded"
      />
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
        <HelpIcon width={16} height={16} aria-hidden />
      </HelpButton>
      <Tooltip
        id={TOOLTIP_ID}
        opened={isGuideOpened}
        placement="bottom-left"
        anchorRef={helpButtonRef}
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

const HelpButton = styled.button`
  position: relative;
  width: 16px;
  height: 16px;
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
