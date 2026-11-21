import { useDevice } from '@bombom/shared/ui-web';
import { renderHook } from '@testing-library/react';
import { useInquiryMessageScroll } from './useInquiryMessageScroll';
import type { RefObject } from 'react';

jest.mock('@bombom/shared/ui-web', () => ({
  useDevice: jest.fn(),
}));

const mockUseDevice = useDevice as jest.Mock;

const createMessageList = ({
  scrollHeight,
  clientHeight,
  scrollTop,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollTop: number;
}) => {
  const element = document.createElement('div');

  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight });
  Object.defineProperty(element, 'clientHeight', { value: clientHeight });
  element.scrollTop = scrollTop;

  return element;
};

const renderScroll = (messageList: HTMLDivElement | null) =>
  renderHook(() =>
    useInquiryMessageScroll({
      messageListRef: {
        current: messageList,
      } as RefObject<HTMLDivElement | null>,
    }),
  );

describe('useInquiryMessageScroll', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.scrollY = 0;
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  describe('PC', () => {
    beforeEach(() => {
      mockUseDevice.mockReturnValue('pc');
    });

    it('메시지 영역을 스크롤 대상으로 삼는다.', () => {
      const messageList = createMessageList({
        scrollHeight: 1000,
        clientHeight: 400,
        scrollTop: 100,
      });
      const { result } = renderScroll(messageList);

      expect(result.current.getScrollTarget()).toBe(messageList);
      expect(result.current.getScrollHeight()).toBe(1000);
      expect(result.current.getViewportHeight()).toBe(400);
      expect(result.current.getScrollPosition()).toBe(100);
    });

    it('맨 아래로 스크롤하면 메시지 영역의 위치를 전체 높이로 맞춘다.', () => {
      const messageList = createMessageList({
        scrollHeight: 1000,
        clientHeight: 400,
        scrollTop: 0,
      });
      const { result } = renderScroll(messageList);

      result.current.scrollToBottom();

      expect(messageList.scrollTop).toBe(1000);
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it('메시지 영역이 아직 없으면 페이지를 스크롤하지 않는다.', () => {
      const { result } = renderScroll(null);

      result.current.scrollToBottom();

      expect(window.scrollTo).not.toHaveBeenCalled();
      expect(result.current.getScrollHeight()).toBe(0);
    });

    it('맨 아래까지 남은 거리는 전체 높이에서 현재 위치와 보이는 높이를 뺀 값이다.', () => {
      const messageList = createMessageList({
        scrollHeight: 1000,
        clientHeight: 400,
        scrollTop: 100,
      });
      const { result } = renderScroll(messageList);

      expect(result.current.getDistanceFromBottom()).toBe(500);
    });
  });

  describe('모바일', () => {
    beforeEach(() => {
      mockUseDevice.mockReturnValue('mobile');
    });

    it('메시지 영역이 있어도 페이지를 스크롤 대상으로 삼는다.', () => {
      const messageList = createMessageList({
        scrollHeight: 1000,
        clientHeight: 400,
        scrollTop: 100,
      });
      const { result } = renderScroll(messageList);

      expect(result.current.getScrollTarget()).toBeNull();
      expect(result.current.getScrollPosition()).toBe(window.scrollY);
    });

    it('맨 아래로 스크롤하면 페이지 전체 높이만큼 이동한다.', () => {
      const { result } = renderScroll(null);

      result.current.scrollToBottom();

      expect(window.scrollTo).toHaveBeenCalledWith(
        0,
        document.body.scrollHeight,
      );
    });
  });
});
