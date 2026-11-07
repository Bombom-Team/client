// web/scripts/prerender.ts(webpack 빌드)에서도 import합니다. 다른 모듈을 import하지 않습니다.

/** 빌드 때 미리 넣은 head 태그에 붙이는 속성입니다. 앱 시작 시 main.tsx가 이 태그를 지웁니다. */
export const PRERENDERED_ATTRIBUTE = 'data-prerendered';
