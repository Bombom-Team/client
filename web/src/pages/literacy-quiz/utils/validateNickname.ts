const BANNED_WORDS = ['시발', '씨발', '병신', '개새', '좆', 'http', 'www.'];

// 서버도 같은 규칙으로 검사한다. 화면에서는 바로 알려 주려고 먼저 확인한다.
export const validateNickname = (value: string) => {
  const nickname = value.trim();
  if (nickname.length < 2 || nickname.length > 10) {
    return '닉네임은 2~10자로 써 주세요';
  }
  if (/[<>]/.test(nickname)) return '‘<’, ‘>’ 기호는 쓸 수 없어요';

  const lowerNickname = nickname.toLowerCase();
  if (BANNED_WORDS.some((word) => lowerNickname.includes(word))) {
    return '쓸 수 없는 단어가 들어 있어요';
  }
  return '';
};
