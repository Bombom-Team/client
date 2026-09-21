import { useLayoutEffect } from 'react';
import { DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE } from '../constants/articleFontSize';
import {
  applyArticleFontScale,
  collectArticleFontScaleTargets,
  restoreArticleFontScaleTargets,
} from '../utils/articleFontScale';
import type { ArticleFontSizePercentage } from '../constants/articleFontSize';
import type { RefObject } from 'react';

interface UseArticleContentFontScaleParams {
  ref: RefObject<HTMLDivElement | null>;
  content: string;
  percentage: ArticleFontSizePercentage;
  onLayoutChange?: () => void;
}

export const useArticleContentFontScale = ({
  ref,
  content,
  percentage,
  onLayoutChange,
}: UseArticleContentFontScaleParams) => {
  useLayoutEffect(() => {
    if (!ref.current) return;

    let targets: ReturnType<typeof collectArticleFontScaleTargets> = [];
    let animationFrameId: number | null = null;
    let rootFontSize = document.documentElement.style.fontSize;

    const updateFontScale = () => {
      restoreArticleFontScaleTargets(targets);
      targets = [];

      if (!ref.current) return;

      if (percentage !== DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE) {
        targets = collectArticleFontScaleTargets(ref.current);
        applyArticleFontScale(targets, percentage);
      }

      onLayoutChange?.();
    };

    const scheduleFontScaleUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateFontScale();
      });
    };

    const updateFontScaleFromRootStyle = () => {
      const nextRootFontSize = document.documentElement.style.fontSize;
      if (rootFontSize === nextRootFontSize) return;

      rootFontSize = nextRootFontSize;
      scheduleFontScaleUpdate();
    };

    updateFontScale();

    // 앱 WebView가 시스템 글자 배율을 <html> 인라인 스타일로 주입한다.
    const rootStyleObserver = new MutationObserver(
      updateFontScaleFromRootStyle,
    );
    rootStyleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
    });
    window.addEventListener('resize', scheduleFontScaleUpdate);

    return () => {
      rootStyleObserver.disconnect();
      window.removeEventListener('resize', scheduleFontScaleUpdate);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      restoreArticleFontScaleTargets(targets);
    };
  }, [content, onLayoutChange, percentage, ref]);
};
