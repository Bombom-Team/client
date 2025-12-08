import styled from '@emotion/styled';
import type { PropsWithChildren } from 'react';

export function CarouselSlide({ children }: PropsWithChildren) {
  return <Slide>{children}</Slide>;
}

const Slide = styled.li`
  flex: 0 0 100%;
`;
