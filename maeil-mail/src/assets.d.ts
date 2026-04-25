/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react';

  const content: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}
