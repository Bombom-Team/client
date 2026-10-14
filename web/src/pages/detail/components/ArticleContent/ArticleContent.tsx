import styled from '@emotion/styled';
import { memo, useRef } from 'react';
import { processContent } from './ArticleContent.utils';
import { useArticleContentFontScale } from '../../hooks/useArticleContentFontScale';
import { useAutoScaleContent } from '../../hooks/useAutoScaleContent';
import { useHighlightHoverEffect } from '../../hooks/useHighlightHoverEffect';
import { extractBodyContent } from '@/utils/element';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
import type { RefObject } from 'react';

interface ArticleContentProps {
  ref: RefObject<HTMLDivElement | null>;
  newsletterName: string;
  content?: string;
  fontSizePercentage: ArticleFontSizePercentage;
}

const ArticleContent = ({
  ref,
  newsletterName,
  content,
  fontSizePercentage,
}: ArticleContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyContent = extractBodyContent(content ?? '');
  const processedContent = processContent(newsletterName, bodyContent);
  const { scale, recalculateScale } = useAutoScaleContent({
    layoutRef: containerRef,
    contentRef: ref,
  });

  useArticleContentFontScale({
    ref,
    content: processedContent,
    percentage: fontSizePercentage,
    onLayoutChange: recalculateScale,
  });

  useHighlightHoverEffect();

  return (
    <Container ref={containerRef}>
      <Content
        ref={ref}
        scale={scale}
        dangerouslySetInnerHTML={{
          __html: processedContent,
        }}
      />
    </Container>
  );
};

export default memo(ArticleContent);

const Container = styled.div`
  overflow: hidden;
  width: 100%;
`;

const Content = styled.div<{ scale: number }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  -webkit-tap-highlight-color: rgb(0 0 0 / 10%);
  -webkit-touch-callout: none;

  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: top left;
  user-select: text;

  word-break: break-all;
  word-wrap: break-word;

  a {
    color: ${({ theme }) => theme.colors.info};

    cursor: pointer;
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }

  mark[data-highlight-id] {
    background-color: #ffeb3b;
    transition: box-shadow 0.2s ease-in-out;
  }

  mark[data-highlight-id].hovered-highlight {
    box-shadow: 0 0 6px rgb(0 0 0 / 30%);
    cursor: pointer;
  }
`;
