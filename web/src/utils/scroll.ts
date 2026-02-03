export const getScrollPercent = (element?: HTMLElement | null) => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  let currentScroll = scrollTop;
  let totalScroll = scrollHeight - clientHeight;

  if (element) {
    const { top, height } = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    currentScroll = top * -1;
    totalScroll = height - viewportHeight;
  }

  if (totalScroll <= 0) return 100;
  if (currentScroll <= 0) return 0;
  if (currentScroll >= totalScroll) return 100;

  return (currentScroll / totalScroll) * 100;
};
