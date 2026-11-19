import { createSessionStorage } from './sessionStorage';

// 가입은 OAuth(서버)나 앱 로그인 화면을 거쳐 /signup으로 들어와서 원래 가려던 경로를 잃는다.
// 로그인 직전에 같은 탭의 sessionStorage에 남겨 두고, 가입이 끝나면 한 번만 꺼내 쓴다.
const POST_SIGNUP_REDIRECT_KEY = 'post-signup-redirect';
const VALID_DURATION_MS = 30 * 60 * 1000;

// createSessionStorage의 Serializable 제약(인덱스 시그니처)을 만족해야 해서 type으로 둔다.
type PostSignupRedirect = {
  path: string;
  savedAt: number;
};

const storage = createSessionStorage<PostSignupRedirect | null>(
  POST_SIGNUP_REDIRECT_KEY,
  null,
);

const isInternalPath = (path: string) =>
  path.startsWith('/') && !path.startsWith('//');

export const savePostSignupRedirect = (path: string) => {
  if (!isInternalPath(path)) return;
  storage.set({ path, savedAt: Date.now() });
};

export const consumePostSignupRedirect = (): string | null => {
  const saved = storage.get();
  storage.remove();
  if (!saved || !isInternalPath(saved.path)) return null;
  if (Date.now() - saved.savedAt > VALID_DURATION_MS) return null;
  return saved.path;
};
