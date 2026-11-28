import { WATERMARK_TEXT } from '../constants/exam';

// 첫 지문 상자 안쪽 오른쪽 아래에 워터마크를 넣는다.
export const addWatermark = (passageHtml: string) =>
  passageHtml.replace(
    '</div>',
    `<span class="wm">${WATERMARK_TEXT}</span></div>`,
  );
