import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
import CloseIcon from '#/assets/svg/close.svg';

const FONT_SIZE_OPTIONS: {
  label: string;
  percentage: ArticleFontSizePercentage;
  sampleFontSize: number;
}[] = [
  { label: '작게', percentage: 90, sampleFontSize: 12 },
  { label: '보통', percentage: 100, sampleFontSize: 14 },
  { label: '크게', percentage: 115, sampleFontSize: 16 },
  { label: '아주 크게', percentage: 130, sampleFontSize: 18 },
  { label: '가장 크게', percentage: 150, sampleFontSize: 20 },
];

interface ArticleFontSizeControlProps {
  percentage: ArticleFontSizePercentage;
  onSelect: (percentage: ArticleFontSizePercentage) => void;
}

const ArticleFontSizeControl = ({
  percentage,
  onSelect,
}: ArticleFontSizeControlProps) => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useClickOutsideRef<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const handleSelect = (nextPercentage: ArticleFontSizePercentage) => {
    onSelect(nextPercentage);
    trackEvent({
      category: 'Article',
      action: '글자 크기 선택',
      label: `${nextPercentage}%`,
    });
    setIsOpen(false);
  };

  const handleTriggerClick = () => {
    if (!isOpen) {
      trackEvent({
        category: 'Article',
        action: '글자 크기 패널 열기',
      });
    }

    setIsOpen((previousIsOpen) => !previousIsOpen);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Container ref={controlRef}>
      <TriggerButton
        type="button"
        aria-label="글자 크기 조절"
        aria-controls="article-font-size-options"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
      >
        <SmallLetter aria-hidden="true">가</SmallLetter>
        <LargeLetter aria-hidden="true">가</LargeLetter>
      </TriggerButton>

      {isOpen && (
        <OptionsPanel id="article-font-size-options" isMobile={isMobile}>
          <PanelHeader>
            <PanelTitle id="article-font-size-title">글자 크기</PanelTitle>
            <CloseButton
              type="button"
              aria-label="글자 크기 조절 닫기"
              onClick={() => setIsOpen(false)}
            >
              <CloseIcon width={20} height={20} fill="currentColor" />
            </CloseButton>
          </PanelHeader>
          <OptionList role="group" aria-labelledby="article-font-size-title">
            {FONT_SIZE_OPTIONS.map((option) => {
              const isSelected = option.percentage === percentage;

              return (
                <OptionButton
                  key={option.percentage}
                  type="button"
                  aria-label={`${option.label} ${option.percentage}퍼센트`}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(option.percentage)}
                >
                  <SampleLetter
                    fontSize={option.sampleFontSize}
                    isSelected={isSelected}
                  >
                    가
                  </SampleLetter>
                  <OptionLabel isSelected={isSelected}>
                    {option.label}
                  </OptionLabel>
                </OptionButton>
              );
            })}
          </OptionList>
        </OptionsPanel>
      )}
    </Container>
  );
};

export default ArticleFontSizeControl;

const Container = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
`;

const TriggerButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.icons};

  &:hover,
  &:focus-visible {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const SmallLetter = styled.span`
  margin-top: 4px;

  font-size: 12px;
  line-height: 1;
`;

const LargeLetter = styled.span`
  margin-bottom: 4px;
  margin-left: -1px;

  font-size: 18px;
  line-height: 1;
`;

const OptionsPanel = styled.div<{ isMobile: boolean }>`
  position: ${({ isMobile }) => (isMobile ? 'fixed' : 'absolute')};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  width: min(320px, calc(100vw - 16px));
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;
  box-shadow: 0 8px 16px rgb(0 0 0 / 12%);

  background-color: ${({ theme }) => theme.colors.white};

  inset: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 8px)`
      : 'auto'} ${({ isMobile }) => (isMobile ? '8px' : 'auto')} ${({ isMobile }) => (isMobile ? 'auto' : '0')} ${({ isMobile }) => (isMobile ? 'auto' : 'calc(100% + 12px)')};
`;

const PanelHeader = styled.div`
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover,
  &:focus-visible {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const OptionList = styled.div`
  display: grid;
  gap: 4px;

  grid-template-columns: repeat(5, minmax(0, 1fr));
`;

const OptionButton = styled.button`
  min-height: 64px;
  padding: 8px 4px;
  border: 0;
  border-radius: 8px;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;

const SampleLetter = styled.span<{
  fontSize: number;
  isSelected: boolean;
}>`
  width: ${({ fontSize }) => `${fontSize + 12}px`};
  height: ${({ fontSize }) => `${fontSize + 12}px`};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primaryBomBom : 'transparent'};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.white : theme.colors.textPrimary};
  font-weight: 700;
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: 1;
`;

const OptionLabel = styled.span<{ isSelected: boolean }>`
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.primaryBomBom : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  white-space: nowrap;
`;
