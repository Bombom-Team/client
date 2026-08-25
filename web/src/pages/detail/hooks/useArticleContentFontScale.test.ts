import { renderHook } from '@testing-library/react';
import { useArticleContentFontScale } from './useArticleContentFontScale';
import type { ArticleFontSizePercentage } from '../constants/articleFontSize';
import type { RefObject } from 'react';

interface HookProps {
  content: string;
  percentage: ArticleFontSizePercentage;
}

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

describe('useArticleContentFontScale', () => {
  it('렌더 HTML이 교체되면 현재 배율을 새 본문에 다시 적용하고 100%에서 원본 스타일을 복구한다.', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<p style="font-size: 12px; line-height: 18px">첫 본문</p>';
    document.body.appendChild(container);

    const ref: RefObject<HTMLDivElement | null> = { current: container };
    const onLayoutChange = jest.fn();
    const initialProps: HookProps = {
      content: '첫 본문 HTML',
      percentage: 150,
    };
    const { rerender } = renderHook(
      ({ content, percentage }: HookProps) =>
        useArticleContentFontScale({
          ref,
          content,
          percentage,
          onLayoutChange,
        }),
      {
        initialProps,
      },
    );

    const firstParagraph = container.querySelector('p');
    expect(firstParagraph?.style.fontSize).toBe('18px');
    expect(firstParagraph?.style.lineHeight).toBe('27px');

    rerender({ content: '첫 본문 HTML', percentage: 115 });

    expect(firstParagraph?.style.fontSize).toBe('13.8px');
    expect(firstParagraph?.style.lineHeight).toBe('20.7px');

    container.innerHTML =
      '<p style="font-size: 20px; line-height: 30px">새 본문</p>';
    rerender({ content: '새 본문 HTML', percentage: 150 });

    const nextParagraph = container.querySelector('p');
    expect(firstParagraph?.style.fontSize).toBe('12px');
    expect(firstParagraph?.style.lineHeight).toBe('18px');
    expect(nextParagraph?.style.fontSize).toBe('30px');
    expect(nextParagraph?.style.lineHeight).toBe('45px');

    rerender({ content: '새 본문 HTML', percentage: 100 });

    expect(nextParagraph?.style.fontSize).toBe('20px');
    expect(nextParagraph?.style.lineHeight).toBe('30px');
    expect(onLayoutChange).toHaveBeenCalledTimes(4);
  });

  it('정리될 때 기존 인라인 값과 important 우선순위를 복구한다.', () => {
    const container = document.createElement('div');
    container.innerHTML =
      '<p style="font-size: 12px !important; line-height: 18px !important">본문</p>';
    document.body.appendChild(container);

    const ref: RefObject<HTMLDivElement | null> = { current: container };
    const { unmount } = renderHook(() =>
      useArticleContentFontScale({
        ref,
        content: '본문 HTML',
        percentage: 150,
      }),
    );
    const paragraph = container.querySelector('p');

    expect(paragraph?.style.fontSize).toBe('18px');
    expect(paragraph?.style.getPropertyPriority('font-size')).toBe('important');

    unmount();

    expect(paragraph?.style.fontSize).toBe('12px');
    expect(paragraph?.style.lineHeight).toBe('18px');
    expect(paragraph?.style.getPropertyPriority('font-size')).toBe('important');
    expect(paragraph?.style.getPropertyPriority('line-height')).toBe(
      'important',
    );
  });

  it('연속 resize를 한 프레임으로 합치고 정리 시 예약 작업과 listener를 제거한다.', () => {
    const requestAnimationFrame = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockReturnValue(1);
    const cancelAnimationFrame = jest.spyOn(window, 'cancelAnimationFrame');
    const container = document.createElement('div');
    container.innerHTML = '<p>본문</p>';
    document.body.appendChild(container);

    const ref: RefObject<HTMLDivElement | null> = { current: container };
    const { unmount } = renderHook(() =>
      useArticleContentFontScale({
        ref,
        content: '본문 HTML',
        percentage: 150,
      }),
    );

    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('resize'));

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);

    window.dispatchEvent(new Event('resize'));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
