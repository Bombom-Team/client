// 시험지 화면은 확정된 프로토타입의 종이·잉크 색을 그대로 쓴다. 공용 theme에 같은 값이 있는 색(봄봄 주황, 흰색)은 theme을 쓴다.
export const LITERACY_COLORS = {
  ink: '#1B1714',
  sub: '#6B625C',
  subDeep: '#4A423C',
  muted: '#A89A90',
  line: '#E6DAD0',
  peach: '#FFE7D8',
  cream: '#FFF7F1',
  creamDeep: '#FFF1E8',
  brandDeep: '#C94A00',
  pen: '#D7372C',
  stamp: '#C8322B',
  paper: '#FBFAF5',
  desk: '#E9E6DF',
  paperLabel: '#ECE8DE',
  paperLine: '#D9D2C5',
  gold: '#FFC83D',
  answerBlue: '#1F5FBF',
  answerBlueLight: '#F1F5FB',
  boardMuted: '#B4A99F',
  boardLine: '#3A312B',
  boardEmpty: '#5A4E46',
  overSoft: '#FF8A80',
  chipBackground: '#F3EBE4',
  rowEmpty: '#F6F1EC',
  rowMe: '#FFE6D6',
  rowEmptyText: '#9C8F86',
  rowEmptyNumber: '#C9BDB3',
  dotOff: '#E2D6CC',
  dotMine: '#F6C7A8',
  logoBorder: '#F1E8E1',
  subscribeHover: '#FFE2D0',
  progressOff: '#E2DCD0',
  watermark: '#A0522D',
  challengeBackground: '#FFF6F4',
  omrBubble: '#9C8F86',
  pcPanel: '#EFEBE3',
  pcRowMe: '#FFE9DA',
  panelText: '#D9CFC7',
} as const;

export const LITERACY_FONTS = {
  display: "'Black Han Sans', 'Noto Sans KR', sans-serif",
  head: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
  body: "'Nanum Gothic', -apple-system, 'Apple SD Gothic Neo', sans-serif",
  serif: "'Nanum Myeongjo', AppleMyungjo, serif",
} as const;

// 프로토타입이 쓰던 글꼴(Black Han Sans·Nanum Myeongjo·Noto Sans KR)을 이 페이지에서만 불러온다.
export const LITERACY_FONT_STYLESHEET_URL =
  'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Nanum+Gothic:wght@400;700;800&family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap';
