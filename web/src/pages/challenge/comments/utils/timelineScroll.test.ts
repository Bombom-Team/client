import {
  canPreservePrependScroll,
  findVisibleDate,
  preservePrependScrollPosition,
} from './timelineScroll';

const createContainer = ({
  scrollHeight = 0,
  clientHeight = 0,
}: {
  scrollHeight?: number;
  clientHeight?: number;
} = {}) => {
  const container = document.createElement('div');
  Object.defineProperty(container, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  Object.defineProperty(container, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
  return container;
};

const mockRect = (
  element: HTMLElement,
  { top, bottom }: { top: number; bottom: number },
) => {
  element.getBoundingClientRect = () =>
    ({ top, bottom, height: bottom - top }) as DOMRect;
};

const createDateSection = (
  date: string,
  rect: { top: number; bottom: number },
) => {
  const section = document.createElement('div');
  section.dataset.commentDateSection = date;
  mockRect(section, rect);
  return section;
};

describe('canPreservePrependScroll', () => {
  it('컨테이너가 스크롤 가능하면 true를 반환한다', () => {
    const container = createContainer({
      scrollHeight: 1000,
      clientHeight: 600,
    });
    expect(canPreservePrependScroll(container)).toBe(true);
  });

  it('컨테이너 내용이 화면보다 작으면 false를 반환한다', () => {
    const container = createContainer({ scrollHeight: 600, clientHeight: 600 });
    expect(canPreservePrependScroll(container)).toBe(false);
  });
});

describe('preservePrependScrollPosition', () => {
  it('위에 내용이 추가되어 높이가 늘어난 만큼 스크롤을 내려 보던 위치를 유지한다', () => {
    const container = createContainer({ scrollHeight: 1000 });
    container.scrollTop = 0;

    const didPreserve = preservePrependScrollPosition(container, 600);

    expect(container.scrollTop).toBe(400);
    expect(didPreserve).toBe(true);
  });

  it('높이 변화가 없으면 스크롤을 이동하지 않고 false를 반환한다', () => {
    const container = createContainer({ scrollHeight: 600 });
    container.scrollTop = 100;

    const didPreserve = preservePrependScrollPosition(container, 600);

    expect(container.scrollTop).toBe(100);
    expect(didPreserve).toBe(false);
  });
});

describe('findVisibleDate', () => {
  const createContainerWithSections = (
    sections: { date: string; top: number; bottom: number }[],
  ) => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });
    sections.forEach(({ date, top, bottom }) => {
      container.appendChild(createDateSection(date, { top, bottom }));
    });
    return container;
  };

  it('기준선(컨테이너 상단 + 80px)에 걸친 섹션의 날짜를 반환한다', () => {
    const container = createContainerWithSections([
      { date: '2026-07-09', top: 0, bottom: 300 },
      { date: '2026-07-08', top: 300, bottom: 600 },
    ]);

    expect(findVisibleDate(container)).toBe('2026-07-09');
  });

  it('스크롤이 내려가 다음 섹션이 기준선에 걸치면 해당 날짜를 반환한다', () => {
    const container = createContainerWithSections([
      { date: '2026-07-09', top: -400, bottom: -100 },
      { date: '2026-07-08', top: -100, bottom: 200 },
    ]);

    expect(findVisibleDate(container)).toBe('2026-07-08');
  });

  it('기준선에 걸친 섹션이 없으면 기준선에 가장 가까운 섹션의 날짜를 반환한다', () => {
    const container = createContainerWithSections([
      { date: '2026-07-09', top: -300, bottom: -100 },
      { date: '2026-07-08', top: 120, bottom: 300 },
    ]);

    expect(findVisibleDate(container)).toBe('2026-07-08');
  });

  it('날짜 섹션이 없으면 undefined를 반환한다', () => {
    const container = createContainerWithSections([]);

    expect(findVisibleDate(container)).toBeUndefined();
  });
});
