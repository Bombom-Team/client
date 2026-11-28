import { createSessionStorage } from '@/utils/sessionStorage';

// 마지막 시도 결과(JSON 문자열). 다른 페이지에 갔다가 돌아오면 결과 마지막 장을 다시 보여 준다.
export const lastResultStorage = createSessionStorage<string>(
  'bombom-literacy-last-result',
);
