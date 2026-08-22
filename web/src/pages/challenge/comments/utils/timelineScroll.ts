const VISIBLE_DATE_LINE_OFFSET = 80;

export interface TopSectionAnchor {
  date: string;
  gap: number;
}

export const captureTopSectionAnchor = (
  container: HTMLElement,
): TopSectionAnchor | null => {
  const section = container.querySelector<HTMLElement>(
    '[data-comment-date-section]',
  );
  if (!section) return null;

  const containerTop = container.getBoundingClientRect().top;
  return {
    date: section.dataset.commentDateSection ?? '',
    gap: section.getBoundingClientRect().top - containerTop,
  };
};

export const restoreTopSectionAnchor = (
  container: HTMLElement,
  anchor: TopSectionAnchor,
) => {
  const section = container.querySelector<HTMLElement>(
    `[data-comment-date-section="${anchor.date}"]`,
  );
  if (!section) return false;

  const containerTop = container.getBoundingClientRect().top;
  const currentGap = section.getBoundingClientRect().top - containerTop;
  const delta = currentGap - anchor.gap;
  if (delta === 0) return false;

  container.scrollTop += delta;
  return true;
};

export const findVisibleDate = (container: HTMLElement) => {
  const layerElements = Array.from(
    container.querySelectorAll<HTMLElement>('[data-comment-date-section]'),
  );
  if (layerElements.length === 0) return undefined;

  const visibleLine =
    container.getBoundingClientRect().top + VISIBLE_DATE_LINE_OFFSET;
  const visibleLayer =
    layerElements.find((element) => {
      const elementRect = element.getBoundingClientRect();

      return elementRect.top <= visibleLine && elementRect.bottom > visibleLine;
    }) ??
    layerElements.reduce((nearestElement, element) => {
      const nearestDistance = Math.abs(
        nearestElement.getBoundingClientRect().top - visibleLine,
      );
      const elementDistance = Math.abs(
        element.getBoundingClientRect().top - visibleLine,
      );

      return elementDistance < nearestDistance ? element : nearestElement;
    });

  return visibleLayer.dataset.commentDateSection;
};
