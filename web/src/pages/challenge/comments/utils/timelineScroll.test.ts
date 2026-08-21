import {
  captureTopSectionAnchor,
  findVisibleDate,
  restoreTopSectionAnchor,
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

describe('captureTopSectionAnchor', () => {
  it('최상단 섹션의 날짜와 컨테이너 상단으로부터의 거리를 기록한다', () => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });
    container.appendChild(
      createDateSection('2026-07-16', { top: 5, bottom: 305 }),
    );
    container.appendChild(
      createDateSection('2026-07-15', { top: 305, bottom: 605 }),
    );

    expect(captureTopSectionAnchor(container)).toEqual({
      date: '2026-07-16',
      gap: 5,
    });
  });

  it('날짜 섹션이 없으면 null을 반환한다', () => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });

    expect(captureTopSectionAnchor(container)).toBeNull();
  });
});

describe('restoreTopSectionAnchor', () => {
  it('앵커 섹션이 위쪽 prepend로 밀려난 만큼 스크롤을 보정한다', () => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });
    // 위에 150px 섹션이 추가되어 앵커(7/16)가 gap 5 → 155로 밀려난 상태
    container.appendChild(
      createDateSection('2026-07-17', { top: 5, bottom: 155 }),
    );
    container.appendChild(
      createDateSection('2026-07-16', { top: 155, bottom: 455 }),
    );
    container.scrollTop = 0;

    const didPreserve = restoreTopSectionAnchor(container, {
      date: '2026-07-16',
      gap: 5,
    });

    expect(container.scrollTop).toBe(150);
    expect(didPreserve).toBe(true);
  });

  it('앵커 위치가 그대로면(아래쪽만 변함) 스크롤을 이동하지 않고 false를 반환한다', () => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });
    container.appendChild(
      createDateSection('2026-07-16', { top: 5, bottom: 305 }),
    );
    container.appendChild(
      createDateSection('2026-07-15', { top: 305, bottom: 605 }),
    );
    container.scrollTop = 100;

    const didPreserve = restoreTopSectionAnchor(container, {
      date: '2026-07-16',
      gap: 5,
    });

    expect(container.scrollTop).toBe(100);
    expect(didPreserve).toBe(false);
  });

  it('앵커 섹션을 더 이상 찾을 수 없으면 false를 반환한다', () => {
    const container = createContainer();
    mockRect(container, { top: 0, bottom: 800 });
    container.appendChild(
      createDateSection('2026-07-15', { top: 5, bottom: 305 }),
    );
    container.scrollTop = 100;

    const didPreserve = restoreTopSectionAnchor(container, {
      date: '2026-07-16',
      gap: 5,
    });

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
