const EMOJI_PATTERN = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;
const PRESERVED_WHITE_SPACE_PATTERN = /^(pre|pre-wrap|pre-line|break-spaces)$/;
const BLOCK_SELECTOR =
  'p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote, pre, table, hr';
const PARAGRAPH_SPLIT_TAG = 'paste-paragraph-split';

// 원본에서 줄바꿈이 그대로 보이던 텍스트인지 — 가장 가까운 inline white-space 스타일로 판단
const isWhiteSpacePreserved = (node: Node): boolean => {
  let element = node.parentElement;
  if (element?.closest('pre, code')) return false;
  while (element) {
    const { whiteSpace } = element.style;
    if (whiteSpace) return PRESERVED_WHITE_SPACE_PATTERN.test(whiteSpace);
    element = element.parentElement;
  }
  return false;
};

// Discord·Slack 등은 이모지를 <img alt="🌸">로 복사 → 이미지 노드로 읽히다 사라지므로 문자로 되돌림
const replaceEmojiImages = (body: HTMLElement) => {
  body.querySelectorAll('img').forEach((image) => {
    const alt = image.getAttribute('alt') ?? '';
    const isEmoji =
      EMOJI_PATTERN.test(alt) || image.getAttribute('data-type') === 'emoji';
    if (isEmoji && alt) image.replaceWith(alt);
  });
};

// 줄바꿈 1개는 <br>, 2개 이상은 문단 경계로 바꿈. 문단 경계를 만들 수 없는 구조면 모두 <br>
const replaceLineBreaks = (body: HTMLElement, canSplitParagraph: boolean) => {
  const walker = body.ownerDocument.createTreeWalker(
    body,
    NodeFilter.SHOW_TEXT,
  );
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.data.includes('\n') && isWhiteSpacePreserved(node)) {
      textNodes.push(node);
    }
  }

  textNodes.forEach((textNode) => {
    const fragment = body.ownerDocument.createDocumentFragment();
    textNode.data.split(/(\n+)/).forEach((part) => {
      if (!part.includes('\n')) {
        if (part) fragment.append(part);
        return;
      }
      if (part.length === 1 || !canSplitParagraph) {
        for (let i = 0; i < part.length; i += 1) {
          fragment.append(body.ownerDocument.createElement('br'));
        }
        return;
      }
      // 빈 줄이 여러 개면 경계 사이에 빈 문단을 남김
      for (let i = 1; i < part.length; i += 1) {
        fragment.append(body.ownerDocument.createElement(PARAGRAPH_SPLIT_TAG));
      }
    });
    textNode.replaceWith(fragment);
  });
};

// 경계 표시를 기준으로 인라인 내용을 <p>로 나눔. extractContents가 걸쳐 있는 <span>도 함께 쪼갬
const splitIntoParagraphs = (body: HTMLElement) => {
  const doc = body.ownerDocument;
  const markers = Array.from(body.querySelectorAll(PARAGRAPH_SPLIT_TAG));
  if (markers.length === 0) return;

  const paragraphs: HTMLParagraphElement[] = [];
  const range = doc.createRange();
  markers.forEach((marker) => {
    range.setStart(body, 0);
    range.setEndBefore(marker);
    const paragraph = doc.createElement('p');
    paragraph.append(range.extractContents());
    paragraphs.push(paragraph);
    marker.remove();
  });
  const lastParagraph = doc.createElement('p');
  lastParagraph.append(...Array.from(body.childNodes));
  paragraphs.push(lastParagraph);

  body.replaceChildren(...paragraphs);
};

// 외부에서 붙여넣은 HTML을 원본에 보이던 줄바꿈·이모지 그대로 에디터에 들어가게 정리
export const normalizePastedHtml = (html: string): string => {
  // 에디터 안에서 복사한 내용은 이미 문서 구조를 갖고 있으므로 그대로 사용
  if (html.includes('data-pm-slice')) return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const { body } = doc;
  replaceEmojiImages(body);
  const canSplitParagraph = body.querySelector(BLOCK_SELECTOR) === null;
  replaceLineBreaks(body, canSplitParagraph);
  splitIntoParagraphs(body);
  return body.innerHTML;
};
