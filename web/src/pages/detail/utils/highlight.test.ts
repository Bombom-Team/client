import {
  addHighlightToDOM,
  removeDeletedHighlights,
  removeHighlightFromDOM,
  restoreHighlightAll,
  saveSelection,
} from './highlight';
import { getXPathForNode } from './selection';
import type { Highlight } from '../types/highlight';

const ARTICLE_ID = 1;
const HIGHLIGHT_ID = 10;
const OTHER_HIGHLIGHT_ID = 20;
const ARTICLE_HTML =
  '<table><tbody><tr><td>' +
  '<p>첫 번째 문단입니다. <span>색이 있는 글자</span> 그리고 끝.</p>' +
  '<p>두 번째 문단입니다. 여기도 형광펜을 칠합니다.</p>' +
  '</td></tr></tbody></table>';

// 본문을 wrapperCount겹의 div로 감싸 화면 구조를 흉내 낸다.
const renderContent = (wrapperCount: number) => {
  const content = document.createElement('div');
  content.innerHTML = ARTICLE_HTML;

  let outermost = content;
  for (let count = 0; count < wrapperCount; count += 1) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(outermost);
    outermost = wrapper;
  }
  document.body.appendChild(outermost);

  return content;
};

const getParagraph = (content: HTMLElement, index: number) => {
  const paragraph = content.querySelectorAll('p')[index];
  if (!paragraph) throw new Error(`${index}번째 문단이 없습니다.`);

  return paragraph;
};

const createRange = (
  startNode: Node,
  startOffset: number,
  endNode: Node,
  endOffset: number,
) => {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  return range;
};

const saveHighlight = (
  content: HTMLElement,
  range: Range,
  id = HIGHLIGHT_ID,
): Highlight => {
  const data = saveSelection(content, range, ARTICLE_ID);
  if (!data) throw new Error('선택 범위를 저장하지 못했습니다.');

  return { ...data, id };
};

// 문서 전체 기준 경로로 저장하던 예전 형식의 형광펜을 만든다.
const createDocumentXPathHighlight = (
  container: Element,
  startOffset: number,
  endOffset: number,
  text: string,
): Highlight => ({
  id: HIGHLIGHT_ID,
  articleId: ARTICLE_ID,
  color: '#FFD6C2',
  text,
  location: {
    startXPath: getXPathForNode(container),
    startOffset,
    endXPath: getXPathForNode(container),
    endOffset,
  },
});

const getMarkedText = (container: HTMLElement, id?: number) => {
  const selector =
    id === undefined
      ? 'mark[data-highlight-id]'
      : `mark[data-highlight-id="${id}"]`;
  const marks = Array.from(container.querySelectorAll(selector));

  // 겹쳐 칠한 형광펜은 mark가 안팎으로 놓이므로 가장 바깥 것만 센다.
  return marks
    .filter((mark) => !mark.parentElement?.closest(selector))
    .map((mark) => mark.textContent)
    .join('');
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('saveSelection', () => {
  it('본문 안의 글자를 선택하면 본문 기준 경로로 저장한다', () => {
    const content = renderContent(3);
    const text = getParagraph(content, 1).firstChild!;

    const data = saveSelection(
      content,
      createRange(text, 2, text, 8),
      ARTICLE_ID,
    );

    expect(data?.location).toEqual({
      startXPath: './table[1]/tbody[1]/tr[1]/td[1]/p[2]',
      startOffset: 2,
      endXPath: './table[1]/tbody[1]/tr[1]/td[1]/p[2]',
      endOffset: 8,
    });
    expect(data?.text).toBe('번째 문단입');
  });

  it('선택 끝이 글자가 아닌 요소에 놓이면 글자 위치로 바꿔 저장한다', () => {
    const content = renderContent(1);
    const first = getParagraph(content, 0);
    const second = getParagraph(content, 1);

    const untilParagraphEnd = saveSelection(
      content,
      createRange(first.firstChild!, 2, first, first.childNodes.length),
      ARTICLE_ID,
    );
    const untilNextParagraph = saveSelection(
      content,
      createRange(first.firstChild!, 2, second, 0),
      ARTICLE_ID,
    );

    expect(untilParagraphEnd?.location.endOffset).toBe(
      first.textContent.length,
    );
    expect(untilNextParagraph?.location.endOffset).toBe(
      first.textContent.length,
    );
  });

  it('이미 칠한 형광펜 안을 선택하면 형광펜을 감싼 요소 기준으로 저장한다', () => {
    const content = renderContent(1);
    const text = getParagraph(content, 1).firstChild!;
    addHighlightToDOM(
      content,
      saveHighlight(content, createRange(text, 0, text, 10)),
    );
    const markedText = content.querySelector('mark')!.firstChild!;

    const data = saveSelection(
      content,
      createRange(markedText, 2, markedText, 5),
      ARTICLE_ID,
    );

    expect(data?.location.startXPath).toBe(
      './table[1]/tbody[1]/tr[1]/td[1]/p[2]',
    );
    expect(data?.location.startOffset).toBe(2);
    expect(data?.location.endOffset).toBe(5);
  });

  it('경로가 서버 한도 255자를 넘으면 더 바깥 요소 기준으로 저장하고 같은 글자를 그린다', () => {
    const content = document.createElement('div');
    const depth = 40;
    content.innerHTML = `${'<div>'.repeat(depth)}<p>깊은 곳에 있는 문단입니다.</p>${'</div>'.repeat(depth)}`;
    document.body.appendChild(content);
    const text = content.querySelector('p')!.firstChild!;
    const paragraphXPathLength = getXPathForNode(text, content).length;

    const highlight = saveHighlight(content, createRange(text, 3, text, 9));
    addHighlightToDOM(content, highlight);

    expect(paragraphXPathLength).toBeGreaterThan(255);
    expect(highlight.location.startXPath.length).toBeLessThanOrEqual(255);
    expect(getMarkedText(content)).toBe('곳에 있는 ');
  });

  it('선택이 본문 밖에 걸치면 저장하지 않는다', () => {
    const title = document.createElement('h1');
    title.textContent = '제목';
    document.body.appendChild(title);
    const content = renderContent(1);
    const text = getParagraph(content, 0).firstChild!;

    const data = saveSelection(
      content,
      createRange(title.firstChild!, 0, text, 4),
      ARTICLE_ID,
    );

    expect(data).toBeNull();
  });
});

describe('addHighlightToDOM', () => {
  it('본문 바깥 구조가 바뀌면 저장한 위치에 그대로 그린다', () => {
    const savedContent = renderContent(1);
    const first = getParagraph(savedContent, 0);
    const highlight = saveHighlight(
      savedContent,
      createRange(first.firstChild!, 2, getParagraph(savedContent, 1), 0),
    );
    document.body.innerHTML = '';
    document.body.appendChild(document.createElement('div'));
    const content = renderContent(3);

    addHighlightToDOM(content, highlight);

    expect(getMarkedText(content)).toBe(highlight.text);
  });

  it('문서 전체 기준으로 저장된 형광펜은 바깥 구조가 바뀌면 글자가 같은 위치에 그린다', () => {
    const savedContent = renderContent(1);
    const highlight = createDocumentXPathHighlight(
      getParagraph(savedContent, 1),
      2,
      8,
      '번째 문단입',
    );
    document.body.innerHTML = '';
    // 화면 전환 중에는 이전 화면 사본이 본문 앞에 놓인다.
    const snapshot = document.createElement('div');
    snapshot.innerHTML = `<div>${ARTICLE_HTML}</div>`;
    document.body.appendChild(snapshot);
    const content = renderContent(3);

    addHighlightToDOM(content, highlight);

    expect(highlight.location.startXPath).toMatch(/^\.\/html\[1\]/);
    expect(getMarkedText(content)).toBe('번째 문단입');
    expect(getMarkedText(snapshot)).toBe('');
  });

  it('문서 전체 기준으로 저장된 형광펜은 글자가 달라도 바깥 구조가 같으면 저장된 위치에 그린다', () => {
    const content = renderContent(1);
    const highlight = createDocumentXPathHighlight(
      getParagraph(content, 1),
      2,
      8,
      '서버에서 다듬어진 글자',
    );

    addHighlightToDOM(content, highlight);

    expect(getMarkedText(content)).toBe('번째 문단입');
  });

  it.each([
    { name: '끝', startOffset: 2, endOffset: -1 },
    { name: '시작', startOffset: -1, endOffset: 8 },
  ])(
    '$name 오프셋이 -1로 저장된 형광펜은 저장된 글자 수로 되살려 그린다',
    ({ startOffset, endOffset }) => {
      const content = renderContent(1);
      const highlight = createDocumentXPathHighlight(
        getParagraph(content, 1),
        startOffset,
        endOffset,
        '번째 문단입',
      );

      addHighlightToDOM(content, highlight);

      expect(getMarkedText(content)).toBe('번째 문단입');
    },
  );

  it('되살린 위치의 글자가 저장된 글자와 다르면 그리지 않는다', () => {
    const content = renderContent(1);
    const highlight = createDocumentXPathHighlight(
      getParagraph(content, 1),
      2,
      -1,
      '서버에서 다듬어진 글자',
    );

    addHighlightToDOM(content, highlight);

    expect(content.querySelectorAll('mark')).toHaveLength(0);
  });

  it('두 오프셋이 모두 -1이면 본문에 한 번만 나오는 글자를 찾아 그린다', () => {
    const savedContent = renderContent(1);
    const highlight = createDocumentXPathHighlight(
      getParagraph(savedContent, 1),
      -1,
      -1,
      '여기도 형광펜을 칠합니다.',
    );
    document.body.innerHTML = '';
    const content = renderContent(3);

    addHighlightToDOM(content, highlight);

    expect(getMarkedText(content)).toBe('여기도 형광펜을 칠합니다.');
  });

  it('두 오프셋이 모두 -1이면 style 안의 같은 글자는 세지 않고 본문 글자를 찾아 그린다', () => {
    const content = renderContent(1);
    const style = document.createElement('style');
    style.textContent = '/* 여기도 형광펜을 칠합니다. */';
    content.prepend(style);
    const highlight = createDocumentXPathHighlight(
      getParagraph(content, 1),
      -1,
      -1,
      '여기도 형광펜을 칠합니다.',
    );

    addHighlightToDOM(content, highlight);

    expect(getMarkedText(content)).toBe('여기도 형광펜을 칠합니다.');
    expect(style.querySelector('mark')).toBeNull();
  });

  it('두 오프셋이 모두 -1이고 같은 글자가 본문에 여러 번 나오면 그리지 않는다', () => {
    const content = renderContent(1);
    const highlight = createDocumentXPathHighlight(
      getParagraph(content, 1),
      -1,
      -1,
      '번째 문단입',
    );

    addHighlightToDOM(content, highlight);

    expect(content.querySelectorAll('mark')).toHaveLength(0);
  });

  it('선택이 style 요소를 가로지르면 그 안의 글자는 저장하지도 감싸지도 않는다', () => {
    const content = renderContent(1);
    const first = getParagraph(content, 0);
    const second = getParagraph(content, 1);
    const style = document.createElement('style');
    style.textContent = '.title { color: red; }';
    first.after(style);

    const highlight = saveHighlight(
      content,
      createRange(first.lastChild!, 1, second.firstChild!, 4),
    );
    addHighlightToDOM(content, highlight);

    expect(highlight.text).toBe('그리고 끝.두 번째');
    expect(getMarkedText(content)).toBe('그리고 끝.두 번째');
    expect(style.querySelector('mark')).toBeNull();
    expect(style.textContent).toBe('.title { color: red; }');
  });

  it('같은 형광펜을 다시 그리면 mark를 겹쳐 만들지 않는다', () => {
    const content = renderContent(1);
    const text = getParagraph(content, 1).firstChild!;
    const highlight = saveHighlight(content, createRange(text, 2, text, 8));

    restoreHighlightAll(content, [highlight]);
    restoreHighlightAll(content, [highlight]);

    expect(content.querySelectorAll('mark')).toHaveLength(1);
    expect(getMarkedText(content)).toBe('번째 문단입');
  });
});

describe('removeHighlightFromDOM', () => {
  it('겹쳐 칠한 형광펜에서 바깥 것을 지우면 안쪽 형광펜을 남긴다', () => {
    const content = renderContent(1);
    const paragraph = getParagraph(content, 1);
    const text = paragraph.firstChild!;
    const outer = saveHighlight(content, createRange(text, 0, text, 10));
    addHighlightToDOM(content, outer);
    const markedText = content.querySelector('mark')!.firstChild!;
    const inner = saveHighlight(
      content,
      createRange(markedText, 5, paragraph.lastChild!, 4),
      OTHER_HIGHLIGHT_ID,
    );
    addHighlightToDOM(content, inner);

    removeHighlightFromDOM(outer.id);

    expect(getMarkedText(content, outer.id)).toBe('');
    expect(getMarkedText(content, inner.id)).toBe(inner.text);
    expect(paragraph.textContent).toBe(
      '두 번째 문단입니다. 여기도 형광펜을 칠합니다.',
    );
  });
});

describe('removeDeletedHighlights', () => {
  it('이전 목록에 있다가 빠진 형광펜만 지우고 방금 칠한 형광펜은 남긴다', () => {
    const content = renderContent(1);
    const firstText = getParagraph(content, 0).firstChild!;
    const secondText = getParagraph(content, 1).firstChild!;
    const deleted = saveHighlight(
      content,
      createRange(firstText, 0, firstText, 4),
    );
    // 서버 응답으로 그렸지만 아직 목록에는 없는 형광펜
    const justAdded = saveHighlight(
      content,
      createRange(secondText, 0, secondText, 4),
      OTHER_HIGHLIGHT_ID,
    );
    addHighlightToDOM(content, deleted);
    addHighlightToDOM(content, justAdded);

    removeDeletedHighlights(content, [deleted], []);

    expect(getMarkedText(content, deleted.id)).toBe('');
    expect(getMarkedText(content, justAdded.id)).toBe(justAdded.text);
  });

  it('본문 밖에 있는 화면 전환 사본의 형광펜은 지우지 않는다', () => {
    const content = renderContent(1);
    const text = getParagraph(content, 0).firstChild!;
    const deleted = saveHighlight(content, createRange(text, 0, text, 4));
    addHighlightToDOM(content, deleted);
    const snapshot = document.createElement('div');
    snapshot.innerHTML = content.innerHTML;
    document.body.appendChild(snapshot);

    removeDeletedHighlights(content, [deleted], []);

    expect(getMarkedText(content, deleted.id)).toBe('');
    expect(getMarkedText(snapshot, deleted.id)).toBe(deleted.text);
  });
});
