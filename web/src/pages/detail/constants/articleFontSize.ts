export const ARTICLE_FONT_SIZE_PERCENTAGES = [90, 100, 115, 130, 150] as const;

export const DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE = 100;

export type ArticleFontSizePercentage =
  (typeof ARTICLE_FONT_SIZE_PERCENTAGES)[number];
