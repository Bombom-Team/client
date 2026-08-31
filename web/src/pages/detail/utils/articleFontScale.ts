import { MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID } from '../constants/maeilMail';
import type { ArticleFontSizePercentage } from '../constants/articleFontSize';

const EXCLUDED_TEXT_SELECTOR = [
  'button',
  'input',
  'select',
  'textarea',
  'option',
  '[role="button"]',
  '[contenteditable="true"]',
  '[aria-hidden="true"]',
  `#${MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID}`,
  'script',
  'style',
  'noscript',
  'svg',
].join(',');

const BUTTON_LIKE_LINK_DISPLAYS = new Set([
  'block',
  'flex',
  'inline-block',
  'inline-flex',
]);
const BUTTON_LIKE_LINK_MIN_TOTAL_HORIZONTAL_PADDING = 16;

interface InlineStyleSnapshot {
  value: string;
  priority: string;
}

interface ArticleFontScaleTarget {
  element: HTMLElement;
  fontSize: number;
  lineHeight: number | null;
  preserveOriginalSize: boolean;
  originalFontSize: InlineStyleSnapshot;
  originalLineHeight: InlineStyleSnapshot;
}

const getNumericStyleValue = (value: string) => {
  const numericValue = Number.parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getButtonLikeLink = (
  element: HTMLElement,
  buttonLikeLinkCache: WeakMap<HTMLElement, boolean>,
) => {
  const link = element.closest('a');
  if (!(link instanceof HTMLElement)) return null;

  const cachedResult = buttonLikeLinkCache.get(link);
  if (cachedResult !== undefined) return cachedResult ? link : null;

  const style = window.getComputedStyle(link);
  const horizontalPadding =
    (getNumericStyleValue(style.paddingLeft) ?? 0) +
    (getNumericStyleValue(style.paddingRight) ?? 0);

  const isButtonLike =
    BUTTON_LIKE_LINK_DISPLAYS.has(style.display) &&
    horizontalPadding >= BUTTON_LIKE_LINK_MIN_TOTAL_HORIZONTAL_PADDING;

  buttonLikeLinkCache.set(link, isButtonLike);

  return isButtonLike ? link : null;
};

const getExcludedTextRoot = (
  element: HTMLElement,
  buttonLikeLinkCache: WeakMap<HTMLElement, boolean>,
) => {
  const excludedElement = element.closest(EXCLUDED_TEXT_SELECTOR);
  if (excludedElement instanceof HTMLElement) return excludedElement;

  // 뉴스레터 CTA는 semantic button이 아닌 padding이 있는 링크로 자주 전달된다.
  return getButtonLikeLink(element, buttonLikeLinkCache);
};

const getScalableTextElement = (element: HTMLElement) => {
  if (
    element.matches('mark[data-highlight-id]') &&
    element.parentElement instanceof HTMLElement
  ) {
    return element.parentElement;
  }

  return element;
};

const getInlineStyleSnapshot = (
  element: HTMLElement,
  property: 'font-size' | 'line-height',
): InlineStyleSnapshot => {
  return {
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  };
};

const restoreInlineStyle = (
  element: HTMLElement,
  property: 'font-size' | 'line-height',
  snapshot: InlineStyleSnapshot,
) => {
  if (!snapshot.value) {
    element.style.removeProperty(property);
    return;
  }

  element.style.setProperty(property, snapshot.value, snapshot.priority);
};

const createFontScaleTarget = (
  element: HTMLElement,
  preserveOriginalSize: boolean,
): ArticleFontScaleTarget | null => {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = getNumericStyleValue(computedStyle.fontSize);
  if (!fontSize || fontSize <= 0) return null;

  return {
    element,
    fontSize,
    lineHeight: getNumericStyleValue(computedStyle.lineHeight),
    preserveOriginalSize,
    originalFontSize: getInlineStyleSnapshot(element, 'font-size'),
    originalLineHeight: getInlineStyleSnapshot(element, 'line-height'),
  };
};

export const collectArticleFontScaleTargets = (container: HTMLElement) => {
  const scalableElements = new Set<HTMLElement>();
  const preservedElements = new Set<HTMLElement>();
  const buttonLikeLinkCache = new WeakMap<HTMLElement, boolean>();
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  container.querySelectorAll(EXCLUDED_TEXT_SELECTOR).forEach((element) => {
    if (element instanceof HTMLElement) preservedElements.add(element);
  });

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    if (!textNode.textContent?.trim()) continue;

    const parentElement = textNode.parentElement;
    if (!(parentElement instanceof HTMLElement)) continue;

    const excludedTextRoot = getExcludedTextRoot(
      parentElement,
      buttonLikeLinkCache,
    );
    if (excludedTextRoot) {
      preservedElements.add(excludedTextRoot);
      continue;
    }

    scalableElements.add(getScalableTextElement(parentElement));
  }

  const targets: ArticleFontScaleTarget[] = [];

  scalableElements.forEach((element) => {
    const target = createFontScaleTarget(element, false);
    if (target) targets.push(target);
  });
  preservedElements.forEach((element) => {
    const target = createFontScaleTarget(element, true);
    if (target) targets.push(target);
  });

  return targets;
};

export const applyArticleFontScale = (
  targets: ArticleFontScaleTarget[],
  percentage: ArticleFontSizePercentage,
) => {
  const scale = percentage / 100;

  targets.forEach(({ element, fontSize, lineHeight, preserveOriginalSize }) => {
    const targetScale = preserveOriginalSize ? 1 : scale;

    element.style.setProperty(
      'font-size',
      `${Number((fontSize * targetScale).toFixed(2))}px`,
      'important',
    );

    if (lineHeight !== null) {
      element.style.setProperty(
        'line-height',
        `${Number((lineHeight * targetScale).toFixed(2))}px`,
        'important',
      );
    }
  });
};

export const restoreArticleFontScaleTargets = (
  targets: ArticleFontScaleTarget[],
) => {
  targets.forEach(({ element, originalFontSize, originalLineHeight }) => {
    restoreInlineStyle(element, 'font-size', originalFontSize);
    restoreInlineStyle(element, 'line-height', originalLineHeight);
  });
};
