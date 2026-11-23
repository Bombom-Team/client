// 한국어 번역과 같은 키 구조를 강제해 다른 언어의 번역 누락·초과 키를 타입 검사에서 잡는다
export type Translation<T> = {
  [K in keyof T]: T[K] extends string ? string : Translation<T[K]>;
};
