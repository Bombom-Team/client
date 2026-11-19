export interface HighlightPart {
  text: string;
  isMatch: boolean;
}

// 원문 위치에서 키워드 길이만큼 잘라 비교한다.
// 문자열 전체를 소문자로 바꾸면 길이가 바뀌는 문자(예: İ)가 있어 위치가 어긋나기 때문이다.
const findMatchIndex = (text: string, keyword: string, from: number) => {
  const keywordLength = keyword.length;
  const lowerKeyword = keyword.toLowerCase();
  for (let index = from; index + keywordLength <= text.length; index += 1) {
    if (
      text.slice(index, index + keywordLength).toLowerCase() === lowerKeyword
    ) {
      return index;
    }
  }
  return -1;
};

// 검색 결과처럼 이름에서 입력한 키워드 부분을 나눠 강조할 수 있게 한다. 대소문자는 구분하지 않는다.
export const splitByKeyword = (
  text: string,
  keyword: string,
): HighlightPart[] => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return [{ text, isMatch: false }];

  const parts: HighlightPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = findMatchIndex(text, trimmedKeyword, cursor);
    if (matchIndex === -1) break;
    if (matchIndex > cursor) {
      parts.push({ text: text.slice(cursor, matchIndex), isMatch: false });
    }
    const matchEnd = matchIndex + trimmedKeyword.length;
    parts.push({ text: text.slice(matchIndex, matchEnd), isMatch: true });
    cursor = matchEnd;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), isMatch: false });
  }
  return parts;
};
