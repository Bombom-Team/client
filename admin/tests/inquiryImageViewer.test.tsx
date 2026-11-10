import { ThemeProvider } from '@emotion/react';
import { screen } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InquiryImageViewer } from '../src/pages/inquiries/InquiryImageViewer';
import { theme } from '../src/styles/theme';

const IMAGES = [
  'https://cdn.bombom.news/a.png',
  'https://cdn.bombom.news/b.png',
  'https://cdn.bombom.news/c.png',
];

const renderViewer = (
  images: string[] = IMAGES,
  startIndex = 0,
  onClose = vi.fn(),
) => {
  render(
    <ThemeProvider theme={theme}>
      <InquiryImageViewer
        images={images}
        startIndex={startIndex}
        onClose={onClose}
      />
    </ThemeProvider>,
  );
  return onClose;
};

const currentImageSrc = () =>
  (screen.getByRole('img') as HTMLImageElement).getAttribute('src');

afterEach(cleanup);

describe('첨부 이미지 뷰어', () => {
  it('누른 이미지부터 보여준다', () => {
    renderViewer(IMAGES, 1);

    expect(currentImageSrc()).toBe(IMAGES[1]);
    expect(screen.getByText('2 / 3')).toBeTruthy();
  });

  it('다음 버튼을 누르면 다음 이미지로 넘어간다', () => {
    renderViewer(IMAGES, 0);

    fireEvent.click(screen.getByRole('button', { name: '다음 이미지' }));

    expect(currentImageSrc()).toBe(IMAGES[1]);
  });

  it('마지막에서 다음으로 넘기면 처음으로 돌아온다', () => {
    renderViewer(IMAGES, 2);

    fireEvent.click(screen.getByRole('button', { name: '다음 이미지' }));

    expect(currentImageSrc()).toBe(IMAGES[0]);
  });

  it('처음에서 이전으로 넘기면 마지막으로 간다', () => {
    renderViewer(IMAGES, 0);

    fireEvent.click(screen.getByRole('button', { name: '이전 이미지' }));

    expect(currentImageSrc()).toBe(IMAGES[2]);
  });

  it('좌우 방향키로도 이동한다', () => {
    renderViewer(IMAGES, 0);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(currentImageSrc()).toBe(IMAGES[1]);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(currentImageSrc()).toBe(IMAGES[0]);
  });

  it('ESC를 누르면 닫는다', () => {
    const onClose = renderViewer();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('배경을 누르면 닫는다', () => {
    const onClose = renderViewer();

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('이미지를 눌러도 닫히지 않는다', () => {
    const onClose = renderViewer();

    fireEvent.click(screen.getByRole('img'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('열리면 포커스를 뷰어 안으로 가져온다', () => {
    // 배경 썸네일에 Tab으로 닿으면 뷰어가 하나 더 열리고 방향키가 양쪽을 함께
    // 넘기므로, 포커스가 뷰어 밖에 남아 있으면 안 된다.
    renderViewer();

    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(
      true,
    );
  });

  it('마지막 버튼에서 Tab을 누르면 첫 버튼으로 돌아온다', () => {
    renderViewer();

    const buttons = screen.getAllByRole('button');
    const last = buttons[buttons.length - 1];
    last.focus();

    fireEvent.keyDown(window, { key: 'Tab' });

    expect(document.activeElement).toBe(buttons[0]);
  });

  it('이미지가 한 장이면 이동 버튼과 쪽 번호를 숨긴다', () => {
    renderViewer([IMAGES[0]], 0);

    expect(screen.queryByRole('button', { name: '다음 이미지' })).toBeNull();
    expect(screen.queryByRole('button', { name: '이전 이미지' })).toBeNull();
    expect(screen.queryByText('1 / 1')).toBeNull();
  });
});
