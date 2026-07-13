import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useTimeline } from './useTimeline';
import { VISIBLE_COMMENTS_UNIT } from '../constants/comment';
import { queries } from '@/apis/queries';

jest.mock('./useTimelineScrollSync', () => ({
  useTimelineScrollSync: () => ({ captureScrollBeforePrepend: () => true }),
}));

// ENV는 번들러(DefinePlugin·vite define)가 주입하므로 jest에서는 목킹이 필요하다.
jest.mock('@bombom/shared/env', () => ({
  ENV: {
    baseUrl: 'http://localhost',
    eventBaseUrl: 'http://localhost',
    notificationBaseUrl: 'http://localhost',
    blogBaseUrl: 'http://localhost',
  },
}));

const observedElements = new Map<Element, IntersectionObserverCallback>();

class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = (element: Element) => {
    observedElements.set(element, this.callback);
  };
  disconnect = () => {};
  unobserve = () => {};
}

beforeAll(() => {
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  observedElements.clear();
});

const intersect = async (element: Element) => {
  const callback = observedElements.get(element);
  if (!callback) throw new Error('트리거가 관찰되고 있지 않습니다.');

  await act(async () => {
    callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
};

const CHALLENGE_ID = 1;
// 과거 → 최신 순 (useChallengeCommentDates가 반환하는 순서)
const CHALLENGE_DATES = [
  '2026-07-07',
  '2026-07-08',
  '2026-07-09',
  '2026-07-10',
];

const TimelineHarness = ({ initialDate }: { initialDate: string }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {
    visibleDates,
    newerDateTriggerRef,
    olderDateTriggerRef,
    canShowNewerDateTrigger,
    canShowOlderDateTrigger,
  } = useTimeline({
    scrollContainerRef,
    challengeId: CHALLENGE_ID,
    challengeDates: CHALLENGE_DATES,
    initialDate,
    selectedDate: initialDate,
    onVisibleDateChange: jest.fn(),
  });

  return (
    <div ref={scrollContainerRef}>
      {canShowNewerDateTrigger && (
        <div data-testid="newer-trigger" ref={newerDateTriggerRef} />
      )}
      <ul>
        {visibleDates.map((date) => (
          <li key={date}>{date}</li>
        ))}
      </ul>
      {canShowOlderDateTrigger && (
        <div data-testid="older-trigger" ref={olderDateTriggerRef} />
      )}
    </div>
  );
};

const commentsQueryKey = (date: string) =>
  queries.comments.infiniteList({
    challengeId: CHALLENGE_ID,
    start: date,
    end: date,
    size: VISIBLE_COMMENTS_UNIT,
  }).queryKey;

const seedComments = (
  queryClient: QueryClient,
  date: string,
  { hasMorePages = false } = {},
) => {
  queryClient.setQueryData(commentsQueryKey(date), {
    pages: [{ content: [], last: !hasMorePages, number: 0 }],
    pageParams: [0],
  });
};

const renderTimeline = (initialDate: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const view = render(
    <QueryClientProvider client={queryClient}>
      <TimelineHarness initialDate={initialDate} />
    </QueryClientProvider>,
  );

  return { queryClient, ...view };
};

const visibleDateTexts = () =>
  screen.getAllByRole('listitem').map((item) => item.textContent);

describe('초기 렌더링', () => {
  it('선택한 날짜의 섹션만 먼저 보여준다', () => {
    renderTimeline('2026-07-09');

    expect(visibleDateTexts()).toEqual(['2026-07-09']);
  });

  it('선택한 날짜보다 최신 날짜가 있으면 위쪽(더 최신) 로드 트리거를 보여준다', () => {
    renderTimeline('2026-07-09');

    expect(screen.getByTestId('newer-trigger')).toBeTruthy();
  });

  it('선택한 날짜가 가장 최신이면 위쪽 로드 트리거를 보여주지 않는다', () => {
    renderTimeline('2026-07-10');

    expect(screen.queryByTestId('newer-trigger')).toBeNull();
  });
});

describe('위로 스크롤 — 더 최신 날짜 탐색', () => {
  it('위쪽 트리거에 도달하면 캐시된 최신 날짜 섹션을 위에 추가한다', async () => {
    const { queryClient } = renderTimeline('2026-07-09');
    seedComments(queryClient, '2026-07-10');

    await intersect(screen.getByTestId('newer-trigger'));

    expect(visibleDateTexts()).toEqual(['2026-07-10', '2026-07-09']);
  });

  it('캐시에 없는 날짜면 코멘트를 프리페치한 뒤 섹션을 추가한다', async () => {
    const { queryClient } = renderTimeline('2026-07-09');
    const prefetchSpy = jest
      .spyOn(queryClient, 'prefetchInfiniteQuery')
      .mockResolvedValue(undefined);

    await intersect(screen.getByTestId('newer-trigger'));

    expect(prefetchSpy).toHaveBeenCalled();
    expect(visibleDateTexts()).toEqual(['2026-07-10', '2026-07-09']);
  });

  it('가장 최신 날짜까지 보여준 뒤에는 위쪽 트리거를 제거한다', async () => {
    const { queryClient } = renderTimeline('2026-07-09');
    seedComments(queryClient, '2026-07-10');

    await intersect(screen.getByTestId('newer-trigger'));

    expect(screen.queryByTestId('newer-trigger')).toBeNull();
  });
});

describe('아래로 스크롤 — 더 이전 날짜 탐색', () => {
  it('보이는 마지막 날짜의 코멘트를 끝까지 불러왔으면 아래쪽(더 이전) 로드 트리거를 보여준다', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    seedComments(queryClient, '2026-07-09');

    render(
      <QueryClientProvider client={queryClient}>
        <TimelineHarness initialDate="2026-07-09" />
      </QueryClientProvider>,
    );

    expect(screen.getByTestId('older-trigger')).toBeTruthy();
  });

  it('마지막 날짜의 코멘트가 아직 남아 있으면 아래쪽 트리거를 보여주지 않는다', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    seedComments(queryClient, '2026-07-09', { hasMorePages: true });

    render(
      <QueryClientProvider client={queryClient}>
        <TimelineHarness initialDate="2026-07-09" />
      </QueryClientProvider>,
    );

    expect(screen.queryByTestId('older-trigger')).toBeNull();
  });

  it('아래쪽 트리거에 도달하면 더 이전 날짜 섹션을 아래에 추가한다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    seedComments(queryClient, '2026-07-09');

    render(
      <QueryClientProvider client={queryClient}>
        <TimelineHarness initialDate="2026-07-09" />
      </QueryClientProvider>,
    );

    await intersect(screen.getByTestId('older-trigger'));

    expect(visibleDateTexts()).toEqual(['2026-07-09', '2026-07-08']);
  });
});
