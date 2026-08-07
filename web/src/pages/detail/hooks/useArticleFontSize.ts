import {
  ARTICLE_FONT_SIZE_PERCENTAGES,
  DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE,
} from '../constants/articleFontSize';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { ArticleFontSizePercentage } from '../constants/articleFontSize';

const ARTICLE_FONT_SIZE_STORAGE_KEY = 'article-font-size-percentage';

const isArticleFontSizePercentage = (
  value: unknown,
): value is ArticleFontSizePercentage => {
  return ARTICLE_FONT_SIZE_PERCENTAGES.some(
    (percentage) => percentage === value,
  );
};

export const useArticleFontSize = () => {
  const [storedPercentage, setStoredPercentage] =
    useLocalStorageState<ArticleFontSizePercentage>(
      ARTICLE_FONT_SIZE_STORAGE_KEY,
      DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE,
    );
  const percentage = isArticleFontSizePercentage(storedPercentage)
    ? storedPercentage
    : DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE;
  const currentIndex = ARTICLE_FONT_SIZE_PERCENTAGES.indexOf(percentage);

  const updateFontSize = (nextPercentage: ArticleFontSizePercentage) => {
    setStoredPercentage(nextPercentage);
  };

  const decreaseFontSize = () => {
    const previousPercentage = ARTICLE_FONT_SIZE_PERCENTAGES[currentIndex - 1];
    if (previousPercentage !== undefined) updateFontSize(previousPercentage);
  };

  const increaseFontSize = () => {
    const nextPercentage = ARTICLE_FONT_SIZE_PERCENTAGES[currentIndex + 1];
    if (nextPercentage !== undefined) updateFontSize(nextPercentage);
  };

  return {
    percentage,
    canDecrease: currentIndex > 0,
    canIncrease: currentIndex < ARTICLE_FONT_SIZE_PERCENTAGES.length - 1,
    decreaseFontSize,
    increaseFontSize,
  };
};
