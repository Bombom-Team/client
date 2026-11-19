import { splitByKeyword } from './highlightKeyword';

describe('splitByKeyword', () => {
  it('키워드와 같은 부분을 강조 조각으로 나눈다.', () => {
    expect(splitByKeyword('주간 개발 노트', '주간 개발')).toEqual([
      { text: '주간 개발', isMatch: true },
      { text: ' 노트', isMatch: false },
    ]);
  });

  it('대소문자를 구분하지 않고 원문 표기를 유지한다.', () => {
    expect(splitByKeyword('Daily Dev', 'dev')).toEqual([
      { text: 'Daily ', isMatch: false },
      { text: 'Dev', isMatch: true },
    ]);
  });

  it('여러 번 나오면 모두 강조한다.', () => {
    expect(splitByKeyword('개발 그리고 개발', '개발')).toEqual([
      { text: '개발', isMatch: true },
      { text: ' 그리고 ', isMatch: false },
      { text: '개발', isMatch: true },
    ]);
  });

  it('키워드가 비었거나 없으면 원문 그대로 돌려준다.', () => {
    expect(splitByKeyword('주간 개발 노트', '  ')).toEqual([
      { text: '주간 개발 노트', isMatch: false },
    ]);
    expect(splitByKeyword('주간 개발 노트', '디자인')).toEqual([
      { text: '주간 개발 노트', isMatch: false },
    ]);
  });
});
