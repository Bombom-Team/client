import type { SVGProps } from 'react';

export const ErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx="10" cy="10" r="9" stroke="#EF4444" strokeWidth="1.5" />
    <path d="M7 7L13 13M13 7L7 13" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx="10" cy="10" r="9" stroke="#22C55E" strokeWidth="1.5" />
    <path d="M6.5 10L9 12.5L13.5 7.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <circle cx="10" cy="10" r="9" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M10 9V14" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="6.5" r="0.75" fill="#3B82F6" />
  </svg>
);
