export const ARTICLE_FONT_SIZE_PERCENTAGES = [
  50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
] as const;

export const DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE = 100;

export type ArticleFontSizePercentage =
  (typeof ARTICLE_FONT_SIZE_PERCENTAGES)[number];
