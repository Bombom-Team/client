import { keyframes } from '@emotion/react';

export const FADE_IN = keyframes`
  from {
    opacity: 0;
  }
`;

export const RISE = keyframes`
  from {
    opacity: 0;
    transform: translateY(6cqw) scale(0.96);
  }
`;

export const EVOLVE = keyframes`
  0% {
    opacity: 0.2;
    transform: scale(0.55);
  }

  60% {
    transform: scale(1.12);
  }
`;

export const THUMP = keyframes`
  from {
    opacity: 0;
    transform: rotate(14deg) scale(1.9);
  }
`;

export const FILL = keyframes`
  to {
    width: 100%;
  }
`;

export const PIN_FLY = keyframes`
  from {
    opacity: 0;
    transform: translateY(55cqw) scale(2.4);
  }

  60% {
    opacity: 1;
  }
`;

export const SHEET_UP = keyframes`
  from {
    transform: translateY(100%);
  }
`;

export const PEN_CIRCLE = keyframes`
  from {
    opacity: 0;
    transform: rotate(-10deg) scale(0.4);
  }
`;
