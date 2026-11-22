// web/scripts/prerender.ts(webpack 빌드)에서도 import합니다. 다른 모듈을 import하지 않습니다.

/**
 * JS 실행 전 HTML에만 쓰는 head 태그에 붙이는 속성입니다(index.html의 기본값, 빌드 때 만든 상세 HTML의 태그).
 * 앱 시작 시 main.tsx가 이 태그를 지우고, 같은 태그는 HeadContent가 페이지에 맞게 다시 넣습니다.
 */
export const STATIC_HEAD_ATTRIBUTE = 'data-static-head';
