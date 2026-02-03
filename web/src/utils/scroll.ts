export const getScrollPercent = (element?: HTMLElement | null) => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  let currentScroll = scrollTop;
  let totalScroll = scrollHeight - clientHeight;

  if (element) {
    const { top: elementTop, height: elementHeight } =
      element.getBoundingClientRect();

    currentScroll = elementTop * -1;
    totalScroll = elementHeight - clientHeight;
  }

  if (totalScroll <= 0) return 100;
  if (currentScroll <= 0) return 0;
  if (currentScroll >= totalScroll) return 100;

  return (currentScroll / totalScroll) * 100;
};
