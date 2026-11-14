// jsdom은 matchMedia를 구현하지 않아 useMediaQuery를 쓰는 컴포넌트가 렌더되지 않는다.
// setupFilesAfterEnv는 node 환경 테스트에도 적용되므로 window가 없는 경우를 걸러낸다.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

export {};
