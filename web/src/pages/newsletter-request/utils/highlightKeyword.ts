export interface HighlightPart {
  text: string;
  isMatch: boolean;
}

// 검색 결과처럼 이름에서 입력한 키워드 부분을 나눠 강조할 수 있게 한다. 대소문자는 구분하지 않는다.
export const splitByKeyword = (
  text: string,
  keyword: string,
): HighlightPart[] => {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return [{ text, isMatch: false }];

  const lowerText = text.toLowerCase();
  const lowerKeyword = trimmedKeyword.toLowerCase();
  const parts: HighlightPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerKeyword, cursor);
    if (matchIndex === -1) break;
    if (matchIndex > cursor) {
      parts.push({ text: text.slice(cursor, matchIndex), isMatch: false });
    }
    const matchEnd = matchIndex + lowerKeyword.length;
    parts.push({ text: text.slice(matchIndex, matchEnd), isMatch: true });
    cursor = matchEnd;
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), isMatch: false });
  }
  return parts;
};
