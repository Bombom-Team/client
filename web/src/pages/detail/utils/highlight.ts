import { theme } from '@bombom/shared/theme';
import { logger } from '@bombom/shared/utils';
import {
  getNodeByXPath,
  getTextNodesInRange,
  getXPathForNode,
} from './selection';
import type { Highlight } from '../types/highlight';

const HIGHLIGHT_MARK_SELECTOR = 'mark[data-highlight-id]';
const HIDDEN_TEXT_SELECTOR = 'style, script';
// 서버의 startXPath·endXPath 컬럼 길이
const MAX_XPATH_LENGTH = 255;

// 예전에는 경로를 문서 전체 기준('./html[1]/body[1]/...')으로 저장했다.
const DOCUMENT_XPATH_PREFIX = './html[';

export const highlightNodeSegment = (
  node: Text,
  start: number,
  end: number,
  color: string,
  highlightId: number,
) => {
  const parent = node.parentNode!;
  const before = node.textContent!.slice(0, start);
  const middle = node.textContent!.slice(start, end);
  const after = node.textContent!.slice(end);

  const mark = document.createElement('mark');
  mark.style.backgroundColor = color;
  mark.dataset.highlightId = highlightId.toString();
  mark.textContent = middle;

  const frag = document.createDocumentFragment();
  if (before) frag.appendChild(document.createTextNode(before));
  frag.appendChild(mark);
  if (after) frag.appendChild(document.createTextNode(after));

  parent.replaceChild(frag, node);
};

const getHighlightContainer = (root: HTMLElement, range: Range) => {
  const ancestor = range.commonAncestorContainer;
  let container =
    ancestor instanceof Element ? ancestor : ancestor.parentElement;

  // mark는 형광펜을 그릴 때 생기는 요소라, 경로에 넣으면 다시 열었을 때 찾지 못한다.
  while (container?.matches(HIGHLIGHT_MARK_SELECTOR)) {
    container = container.parentElement;
  }

  return container && root.contains(container) ? container : null;
};

// 경계가 글자가 아닌 요소에 놓인 선택도 글자 위치로 바꾼다.
const getTextOffset = (container: Element, node: Node, offset: number) => {
  const range = document.createRange();
  range.selectNodeContents(container);
  range.setEnd(node, offset);

  return range.toString().length;
};

export const getHighlightOffsets = (container: Element, range: Range) => {
  return {
    start: getTextOffset(container, range.startContainer, range.startOffset),
    end: getTextOffset(container, range.endContainer, range.endOffset),
  };
};

// 메일 본문에 들어 있는 style·script의 글자는 화면에 보이지 않는다.
const isHiddenText = (node: Text) =>
  !!node.parentElement?.closest(HIDDEN_TEXT_SELECTOR);

const getSelectedText = (range: Range) => {
  const fragment = range.cloneContents();
  fragment
    .querySelectorAll(HIDDEN_TEXT_SELECTOR)
    .forEach((element) => element.remove());

  return fragment.textContent ?? '';
};

/**
 * 선택 범위를 본문(root) 기준 위치로 바꾼다.
 * 본문 밖에 걸쳤거나 글자가 없는 선택이면 null을 반환한다.
 */
export const saveSelection = (
  root: HTMLElement,
  range: Range,
  articleId: number,
): Omit<Highlight, 'id' | 'memo'> | null => {
  const text = getSelectedText(range);
  let container = getHighlightContainer(root, range);
  if (!container || !text.trim()) return null;

  // 경로가 서버 한도를 넘으면 더 바깥 요소를 기준으로 삼아 줄인다.
  // 오프셋은 기준 요소 안의 글자 위치라서 어느 조상을 기준으로 해도 같은 곳을 가리킨다.
  let xpath = getXPathForNode(container, root);
  while (xpath.length > MAX_XPATH_LENGTH && container.parentElement) {
    container = container.parentElement;
    xpath = getXPathForNode(container, root);
  }
  const offsets = getHighlightOffsets(container, range);

  return {
    location: {
      startXPath: xpath,
      startOffset: offsets.start,
      endXPath: xpath,
      endOffset: offsets.end,
    },
    articleId,
    color: theme.colors.primaryLight,
    text,
  };
};

const getHighlightRange = (container: Node, start: number, end: number) => {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let currentOffset = 0;

  const positions = {
    startNode: null as Text | null,
    endNode: null as Text | null,
    startOffset: 0,
    endOffset: 0,
  };

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const len = node.textContent!.length;

    // start node 찾기
    if (
      !positions.startNode &&
      start >= currentOffset &&
      start <= currentOffset + len
    ) {
      positions.startNode = node;
      positions.startOffset = start - currentOffset;
    }

    // end node 찾기
    if (
      !positions.endNode &&
      end >= currentOffset &&
      end <= currentOffset + len
    ) {
      positions.endNode = node;
      positions.endOffset = end - currentOffset;
    }

    currentOffset += len;
  }

  if (!positions.startNode || !positions.endNode) return null;

  const range = document.createRange();
  range.setStart(positions.startNode, positions.startOffset);
  range.setEnd(positions.endNode, positions.endOffset);

  return range;
};

interface SavedOffsets {
  start: number;
  end: number;
  isRestored: boolean;
}

/**
 * 예전에는 선택 경계가 글자가 아닌 요소에 놓이면 그쪽 오프셋을 -1로 저장했다.
 * 한쪽만 -1이면 저장된 글자 수로 되살린다.
 */
const getSavedOffsets = ({
  location,
  text,
}: Highlight): SavedOffsets | null => {
  const start = Number(location.startOffset);
  const end = Number(location.endOffset);
  const textLength = text?.length ?? 0;

  if (start >= 0 && end >= 0) return { start, end, isRestored: false };
  if (!textLength) return null;
  if (start >= 0) return { start, end: start + textLength, isRestored: true };
  if (end >= 0) return { start: end - textLength, end, isRestored: true };

  return null;
};

const getRangeByXPath = (
  root: HTMLElement,
  xpath: string,
  xpathRoot: Node,
  { start, end }: SavedOffsets,
) => {
  const container = getNodeByXPath(xpath, xpathRoot);
  if (!container || !root.contains(container)) return null;

  return getHighlightRange(container, start, end);
};

const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * 문서 전체 기준 경로는 본문 바깥 구조가 바뀌면 어긋난다.
 * 경로 앞쪽을 한 단계씩 떼어 본문 기준으로 다시 찾고, 저장된 글자와 같은 위치만 인정한다.
 */
const getRangeByDocumentXPath = (
  root: HTMLElement,
  data: Highlight,
  offsets: SavedOffsets,
) => {
  const { startXPath } = data.location;
  const steps = startXPath.split('/').slice(1);
  const savedText = normalizeText(data.text ?? '');

  if (savedText) {
    for (let depth = 1; depth <= steps.length; depth += 1) {
      const xpath = ['.', ...steps.slice(depth)].join('/');
      const range = getRangeByXPath(root, xpath, root, offsets);

      if (range && normalizeText(range.toString()) === savedText) return range;
    }
  }

  // 되살린 오프셋은 글자로 확인된 위치에만 쓴다.
  if (offsets.isRestored) return null;

  // 글자로 확인하지 못해도, 저장할 때와 바깥 구조가 같으면 그 위치를 쓴다.
  return getRangeByXPath(root, startXPath, document, offsets);
};

/**
 * 두 오프셋이 모두 -1이면 본문에서 저장된 글자를 찾는다.
 * 같은 글자가 여러 번 나오면 어느 것인지 알 수 없어 찾지 않는다.
 */
const getRangeByUniqueText = (root: HTMLElement, text: string) => {
  if (!text?.trim()) return null;

  const rootText = root.textContent ?? '';
  const start = rootText.indexOf(text);
  if (start === -1 || start !== rootText.lastIndexOf(text)) return null;

  return getHighlightRange(root, start, start + text.length);
};

const getRangeFromHighlight = (root: HTMLElement, data: Highlight) => {
  const { startXPath } = data.location;
  const offsets = getSavedOffsets(data);
  if (!offsets) return getRangeByUniqueText(root, data.text);

  return startXPath.startsWith(DOCUMENT_XPATH_PREFIX)
    ? getRangeByDocumentXPath(root, data, offsets)
    : getRangeByXPath(root, startXPath, root, offsets);
};

/**
 * 본문(root)에 모든 하이라이트 그리기
 */
export const restoreHighlightAll = (
  root: HTMLElement,
  highlights: Highlight[],
) => {
  highlights.forEach((highlight) => {
    try {
      addHighlightToDOM(root, highlight);
    } catch (error) {
      logger.error(error);
    }
  });
};

/**
 * 단일 하이라이트를 본문(root)에 추가
 */
export const addHighlightToDOM = (root: HTMLElement, data: Highlight) => {
  // 이미 그린 형광펜을 다시 그리면 mark가 겹친다.
  if (root.querySelector(`mark[data-highlight-id="${data.id}"]`)) return;

  const range = getRangeFromHighlight(root, data);
  if (!range) return;

  // mark로 감싸면 range가 따라 바뀌므로 경계를 먼저 읽어 둔다.
  const { startOffset, endOffset } = range;
  const textNodes = getTextNodesInRange(range);

  textNodes.forEach((node, index) => {
    const isFirst = index === 0;
    const isLast = index === textNodes.length - 1;

    let start = 0;
    let end = node.textContent!.length;
    if (isFirst) start = startOffset;
    if (isLast) end = endOffset;

    // style 안의 글자를 mark로 감싸면 그 스타일이 깨진다.
    if (start < end && !isHiddenText(node)) {
      highlightNodeSegment(node, start, end, data.color, data.id);
    }
  });
};

/**
 * 특정 하이라이트 제거
 */
export const removeHighlightFromDOM = (
  highlightId: number,
  root: ParentNode = document,
) => {
  const marks = root.querySelectorAll(
    `mark[data-highlight-id="${highlightId}"]`,
  );
  // 안쪽에 겹쳐 칠한 다른 형광펜이 함께 지워지지 않게 자식 노드를 그대로 꺼낸다.
  marks.forEach((mark) => {
    mark.replaceWith(...Array.from(mark.childNodes));
  });
};

/**
 * 이전 목록에 있다가 새 목록에서 빠진 하이라이트를 본문(root)에서 제거
 */
export const removeDeletedHighlights = (
  root: HTMLElement,
  previousHighlights: Highlight[],
  highlights: Highlight[],
) => {
  const highlightIds = new Set(highlights.map(({ id }) => id));

  // 화면 전환 중에 남아 있는 이전 화면 사본은 건드리지 않도록 본문 안에서만 지운다.
  previousHighlights
    .filter(({ id }) => !highlightIds.has(id))
    .forEach(({ id }) => removeHighlightFromDOM(id, root));
};
