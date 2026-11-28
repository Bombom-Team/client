import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { PropsWithChildren } from 'react';

interface LiteracyScreenProps {
  isFramed?: boolean;
}

// 휴대폰 폭 화면 틀. 안쪽 크기는 모두 화면 너비 기준(cqw)이라 폭이 달라도 같은 비율로 보인다.
const LiteracyScreen = ({
  isFramed = false,
  children,
}: PropsWithChildren<LiteracyScreenProps>) => {
  return <Container isFramed={isFramed}>{children}</Container>;
};

export default LiteracyScreen;

const Container = styled.div<{ isFramed: boolean }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: ${({ isFramed }) => (isFramed ? '100%' : '100dvh')};
  max-width: ${({ isFramed }) => (isFramed ? '390px' : '480px')};
  margin: 0 auto;
  box-shadow: ${({ isFramed }) =>
    isFramed
      ? '0 0 0 1px rgb(0 0 0 / 6%), 0 20px 60px -20px rgb(40 20 10 / 35%)'
      : 'none'};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.body};

  container-type: inline-size;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  @media (width >= 481px) {
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 6%),
      0 10px 40px rgb(0 0 0 / 8%);
  }
`;
