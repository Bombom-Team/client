import type { SVGProps } from 'react';

const CloseIcon = ({
  width = 36,
  height = 36,
  fill = 'currentColor',
  ...props
}: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="none"
    {...props}
  >
    <path
      d="M10 10L26 26M26 10L10 26"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default CloseIcon;
