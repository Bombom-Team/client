import styled from '@emotion/styled';
import { useRef } from 'react';
import { useArticleContentFontScale } from '@/pages/detail/hooks/useArticleContentFontScale';
import { useAutoScaleContent } from '@/pages/detail/hooks/useAutoScaleContent';
import type { ArticleFontSizePercentage } from '@/pages/detail/constants/articleFontSize';

interface PreviousArticleContentProps {
  content: string;
  showGradient: boolean;
  fontSizePercentage: ArticleFontSizePercentage;
}

const PreviousArticleContent = ({
  content,
  showGradient,
  fontSizePercentage,
}: PreviousArticleContentProps) => {
  const layoutRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scale, recalculateScale } = useAutoScaleContent({
    layoutRef,
    contentRef,
  });

  useArticleContentFontScale({
    ref: contentRef,
    content,
    percentage: fontSizePercentage,
    onLayoutChange: recalculateScale,
  });

  return (
    <Container ref={layoutRef}>
      <Content
        ref={contentRef}
        scale={scale}
        showGradient={showGradient}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
};

export default PreviousArticleContent;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Content = styled.div<{ scale: number; showGradient: boolean }>`
  position: relative;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  -webkit-tap-highlight-color: rgb(0 0 0 / 10%);
  -webkit-touch-callout: default;

  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: top left;
  user-select: text;

  word-break: break-all;
  word-wrap: break-word;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 200px;

    display: ${({ showGradient }) => (showGradient ? 'block' : 'none')};

    background: linear-gradient(
      to bottom,
      transparent,
      ${({ theme }) => theme.colors.white}
    );

    content: '';

    pointer-events: none;
  }

  a {
    color: ${({ theme }) => theme.colors.info};

    cursor: pointer;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`;
