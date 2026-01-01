export interface Highlight {
  id: string;
  highlightedText: string;
  memo?: string;
}

export interface ArticleWithHighlights {
  id: string;
  newsletterName: string;
  articleTitle: string;
  highlights: Highlight[];
}

export const articleHighlights: ArticleWithHighlights[] = [
  {
    id: 'article1',
    newsletterName: '데일리바이트',
    articleTitle: '실패를 성공으로 바꾼 CEO의 이야기',
    highlights: [
      {
        id: '1',
        highlightedText: '실패는 성공의 어머니가 아니라, 성공의 데이터베이스다',
        memo: '실패를 성공의 어머니가 아니라, 성공의 데이터베이스다',
      },
      {
        id: '2',
        highlightedText: '데이터를 축적하고 분석하는 것이 성장의 핵심이다',
      },
      {
        id: '3',
        highlightedText: '데이터를 축적하고 분석하는 것이 성장의 핵심이다',
      },
      {
        id: '4',
        highlightedText: '데이터를 축적하고 분석하는 것이 성장의 핵심이다',
      },
    ],
  },
  {
    id: 'article2',
    newsletterName: '데일리바이트',
    articleTitle: '성공적인 피벗의 비결',
    highlights: [
      {
        id: '3',
        highlightedText: '시장의 목소리를 듣고 빠르게 방향을 전환하라',
      },
      {
        id: '4',
        highlightedText: '고객 피드백을 제품에 즉시 반영하는 속도가 경쟁력이다',
        memo: '피드백 루프를 빠르게 돌리는 것이 중요하다는 걸 배웠다',
      },
    ],
  },
  {
    id: 'article3',
    newsletterName: '테크 인사이트',
    articleTitle: 'AI 기술의 미래',
    highlights: [
      {
        id: '5',
        highlightedText: '생성형 AI는 창의적 작업의 보조 도구가 될 것',
        memo: 'AI를 두려워하지 말고 도구로 활용하는 자세가 필요하다',
      },
    ],
  },
  {
    id: 'article4',
    newsletterName: '스타트업 위클리',
    articleTitle: '스타트업 창업자의 마인드셋',
    highlights: [
      {
        id: '6',
        highlightedText: '완벽함보다는 실행력이 중요하다',
        memo: '완벽함보다는 실행력이 중요하다는 말이 인상깊었다. 실무에 바로 적용해봐야겠다.',
      },
    ],
  },
  {
    id: 'article5',
    newsletterName: '까탈로그',
    articleTitle: '요즘 트렌드',
    highlights: [],
  },
];
