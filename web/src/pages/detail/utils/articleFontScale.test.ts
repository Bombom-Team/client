import {
  applyArticleFontScale,
  collectArticleFontScaleTargets,
  restoreArticleFontScaleTargets,
} from './articleFontScale';
import { ARTICLE_FONT_SIZE_MOCKS } from '../../../mocks/datas/articleFontSizeMocks';
import { extractBodyContent } from '../../../utils/element';
import { processContent } from '../components/ArticleContent/ArticleContent.utils';
import {
  ARTICLE_FONT_SIZE_PERCENTAGES,
  DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE,
} from '../constants/articleFontSize';

const renderArticleContent = (contents: string, newsletterName: string) => {
  const container = document.createElement('div');
  container.innerHTML = processContent(
    newsletterName,
    extractBodyContent(contents),
  );
  document.body.appendChild(container);

  return container;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('articleFontScale 실제 수집 데이터 검증', () => {
  it.each(ARTICLE_FONT_SIZE_MOCKS)(
    '$sourceName의 본문 텍스트를 모든 단계로 조절하고 원래 스타일로 복구한다.',
    ({ detail }) => {
      const container = renderArticleContent(
        detail.contents,
        detail.newsletter.name,
      );
      const targets = collectArticleFontScaleTargets(container);
      const scalableTargets = targets.filter(
        ({ preserveOriginalSize }) => !preserveOriginalSize,
      );
      const preservedTargets = targets.filter(
        ({ preserveOriginalSize }) => preserveOriginalSize,
      );
      const originalStyles = targets.map(({ element }) => ({
        element,
        fontSize: element.style.getPropertyValue('font-size'),
        fontSizePriority: element.style.getPropertyPriority('font-size'),
        lineHeight: element.style.getPropertyValue('line-height'),
        lineHeightPriority: element.style.getPropertyPriority('line-height'),
      }));

      expect(scalableTargets.length).toBeGreaterThan(0);

      ARTICLE_FONT_SIZE_PERCENTAGES.filter(
        (percentage) => percentage !== DEFAULT_ARTICLE_FONT_SIZE_PERCENTAGE,
      ).forEach((percentage) => {
        const scale = percentage / 100;

        applyArticleFontScale(targets, percentage);

        scalableTargets.forEach(({ element, fontSize, lineHeight }) => {
          expect(Number.parseFloat(element.style.fontSize)).toBeCloseTo(
            fontSize * scale,
            1,
          );
          expect(element.style.getPropertyPriority('font-size')).toBe(
            'important',
          );

          if (lineHeight !== null) {
            expect(Number.parseFloat(element.style.lineHeight)).toBeCloseTo(
              lineHeight * scale,
              1,
            );
            expect(element.style.getPropertyPriority('line-height')).toBe(
              'important',
            );
          }
        });

        preservedTargets.forEach(({ element, fontSize, lineHeight }) => {
          expect(Number.parseFloat(element.style.fontSize)).toBeCloseTo(
            fontSize,
            1,
          );

          if (lineHeight !== null) {
            expect(Number.parseFloat(element.style.lineHeight)).toBeCloseTo(
              lineHeight,
              1,
            );
          }
        });
      });

      restoreArticleFontScaleTargets(targets);

      originalStyles.forEach(
        ({
          element,
          fontSize,
          fontSizePriority,
          lineHeight,
          lineHeightPriority,
        }) => {
          expect(element.style.getPropertyValue('font-size')).toBe(fontSize);
          expect(element.style.getPropertyPriority('font-size')).toBe(
            fontSizePriority,
          );
          expect(element.style.getPropertyValue('line-height')).toBe(
            lineHeight,
          );
          expect(element.style.getPropertyPriority('line-height')).toBe(
            lineHeightPriority,
          );
        },
      );
    },
  );

  it('인라인 important 글자 크기와 줄 높이도 비율대로 덮어쓴다.', () => {
    const container = renderArticleContent(
      '<p style="font-size:12px!important;line-height:18px!important">본문</p>',
      '테스트',
    );
    const targets = collectArticleFontScaleTargets(container);

    applyArticleFontScale(targets, 150);

    const paragraph = container.querySelector('p');
    expect(paragraph?.style.getPropertyValue('font-size')).toBe('18px');
    expect(paragraph?.style.getPropertyValue('line-height')).toBe('27px');
    expect(paragraph?.style.getPropertyPriority('font-size')).toBe('important');
    expect(paragraph?.style.getPropertyPriority('line-height')).toBe(
      'important',
    );
  });
});
