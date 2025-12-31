export interface NewsletterHighlight {
  id: string;
  newsletterId: string;
  title: string;
  highlightedText: string;
  memo?: string;
}

export const highlights: Record<string, NewsletterHighlight[]> = {
  newsletter1: [
    {
      id: '1',
      newsletterId: 'newsletter1',
      title: '실패를 성공으로 바꾼 CEO의 이야기',
      highlightedText: '실패는 성공의 어머니가 아니라, 성공의 데이터베이스다',
      memo: '실패를 성공의 어머니가 아니라, 성공의 데이터베이스다',
    },
    {
      id: '2',
      newsletterId: 'newsletter1',
      title: '성공적인 피벗의 비결',
      highlightedText: '시장의 목소리를 듣고 빠르게 방향을 전환하라',
    },
    {
      id: '3',
      newsletterId: 'newsletter1',
      title: '스타트업 창업자의 마인드셋',
      highlightedText: '완벽함보다는 실행력이 중요하다',
      memo: '완벽함보다는 실행력이 중요하다는 말이 인상깊었다. 실무에 바로 적용해봐야겠다.',
    },
  ],
  newsletter2: [
    {
      id: '4',
      newsletterId: 'newsletter2',
      title: 'AI 기술의 미래',
      highlightedText: '생성형 AI는 창의적 작업의 보조 도구가 될 것',
      memo: 'AI를 두려워하지 말고 도구로 활용하는 자세가 필요하다',
    },
  ],
  newsletter3: [],
};
