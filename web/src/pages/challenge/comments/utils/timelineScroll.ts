const VISIBLE_DATE_LINE_OFFSET = 80;

export const canPreservePrependScroll = (container: HTMLElement) => {
  return container.scrollHeight > container.clientHeight;
};

export const preservePrependScrollPosition = (
  container: HTMLElement,
  previousScrollHeight: number,
) => {
  const previousScrollTop = container.scrollTop;

  container.scrollTop += container.scrollHeight - previousScrollHeight;

  return container.scrollTop !== previousScrollTop;
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
