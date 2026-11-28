import {
  NEWSLETTER_TITLES,
  RECOMMENDED_NEWSLETTERS,
} from '../constants/result';
import type { RecommendedNewsletter } from '../types/literacyQuiz';

interface Recommendation {
  titleLines: string[];
  newsletters: RecommendedNewsletter[];
}

export const getRecommendation = (correctCount: number): Recommendation => {
  const titleLines = NEWSLETTER_TITLES[correctCount] ?? NEWSLETTER_TITLES[0]!;
  const { dig, dailyByte, weekend, catalog, careet } = RECOMMENDED_NEWSLETTERS;

  if (correctCount >= 5) return { titleLines, newsletters: [dig, dailyByte] };
  if (correctCount >= 3) {
    return { titleLines, newsletters: [dailyByte, weekend] };
  }
  return { titleLines, newsletters: [catalog, careet] };
};
