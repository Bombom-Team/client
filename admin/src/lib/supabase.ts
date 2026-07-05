import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// 모듈 로드 시점이 아닌 첫 사용 시점에 초기화 —
// 환경변수 누락 시 리뷰어 화면만 에러 폴백으로 처리되고 admin 전체는 살아있도록 함
const getClient = () => {
  if (!client) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다',
      );
    }
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
};

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const instance = getClient();
    const value = Reflect.get(instance, prop);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
