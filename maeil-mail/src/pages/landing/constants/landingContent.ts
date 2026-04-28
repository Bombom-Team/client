export const NAV_ITEMS = [
  { href: '#about', label: '소개' },
  { href: '#experience', label: '경험' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const FEATURE_ITEMS = [
  {
    number: '01',
    title: 'BE/FE 기술 면접 질문 큐레이션',
    description:
      '매일메일 팀 콘텐츠를 바탕으로 핵심 질문을 선별해 제공해요. [텍스트: 질문 선정 기준 상세]',
  },
  {
    number: '02',
    title: '봄봄 안에서 구독 · 열람',
    description:
      '개인 이메일 발송 없이 봄봄 안에서만 제공돼요. [텍스트: 구독 플로우 상세]',
  },
  {
    number: '03',
    title: '짧은 시간 복습 중심 구성',
    description:
      '출퇴근 중에도 빠르게 확인할 수 있도록 스낵형 리딩으로 구성했어요. [텍스트: 카드 타입별 예시]',
  },
  {
    number: '04',
    title: '무료 제공 + 지속 개선',
    description:
      '현재 무료로 제공되며, 봄봄 안에서 활용성을 계속 개선할 예정이에요. [텍스트: 업데이트 예정 항목]',
  },
] as const;

export const FLOW_PATH_POINTS = [
  { x: 140, y: 110 },
  { x: 520, y: 310 },
  { x: 330, y: 560 },
  { x: 900, y: 760 },
] as const;

export const EXPERIENCE_NOTES = [
  {
    title: '홈 피드 예시',
    text: '[example 이미지] 오늘의 질문 카드 UI',
  },
  {
    title: '질문 상세 예시',
    text: '[example 이미지] 질문/해설/핵심 포인트 UI',
  },
  {
    title: '구독 완료 예시',
    text: '[example 이미지] 구독 상태 및 트랙 표시 UI',
  },
  {
    title: '개인화 추천 예시',
    text: '[텍스트] 관심 분야 기반 큐레이션 영역',
  },
] as const;

export const FAQ_ITEMS = [
  {
    id: 'delivery',
    question: '제 개인 이메일로 매일메일이 오나요?',
    answer:
      '아니요. 매일메일은 봄봄 서비스 안에서만 제공돼요. 봄봄에서 구독하고, 봄봄에서 읽는 방식이에요.',
  },
  {
    id: 'source',
    question: '매일메일 콘텐츠는 누가 제공하나요?',
    answer:
      '매일메일 팀의 콘텐츠를 바탕으로 제공돼요. 추후 봄봄에서도 더 편하게 읽고 활용하실 수 있도록 계속 개선해갈 예정이에요.',
  },
  {
    id: 'platform',
    question: '왜 다른 이메일 주소로는 제공하지 않나요?',
    answer:
      '장기적으로 무료로 서비스를 제공하기 위해, 현재는 봄봄 안에서만 콘텐츠를 제공하고 있어요.',
  },
  {
    id: 'free',
    question: '매일메일은 무료인가요?',
    answer: '네. 봄봄에서 제공되는 매일메일은 무료로 이용하실 수 있어요.',
  },
  {
    id: 'unsubscribe',
    question: '구독을 해지할 수 있나요?',
    answer:
      '구독 해지는 추후 지원할 예정이에요. 그전까지는 채널톡으로 문의해 주세요.',
  },
  {
    id: 'support',
    question: '구독했는데 콘텐츠가 안 보이거나 문제가 있어요.',
    answer:
      '이용 중 문제가 있으면 채널톡으로 문의해 주세요. 확인 후 빠르게 도와드릴게요.',
  },
] as const;
