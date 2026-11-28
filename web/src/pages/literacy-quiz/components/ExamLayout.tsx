import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { PropsWithChildren, ReactNode, Ref } from 'react';
import logo from '#/assets/avif/logo.avif';

interface ExamLayoutProps {
  title: string;
  topAside: ReactNode;
  topExtra: ReactNode;
  bottomLabel: string;
  buttonLabel: string;
  onButtonClick: () => void;
  isButtonDisabled?: boolean;
  isBlurred?: boolean;
  isBackgroundInert?: boolean;
  isBottomAlert?: boolean;
  isProtected?: boolean;
  containerRef?: Ref<HTMLDivElement>;
  overlay?: ReactNode;
}

// 휴대폰 시험지(수능 시험지형) 틀: 위 고정 줄 · 문제지 · 아래 고정 줄. 풀이와 '문제와 해설'이 함께 쓴다.
const ExamLayout = ({
  title,
  topAside,
  topExtra,
  bottomLabel,
  buttonLabel,
  onButtonClick,
  isButtonDisabled = false,
  isBlurred = false,
  isBackgroundInert = false,
  isBottomAlert = false,
  isProtected = false,
  containerRef,
  overlay,
  children,
}: PropsWithChildren<ExamLayoutProps>) => {
  return (
    <Container ref={containerRef}>
      <Top inert={isBackgroundInert}>
        <TopRow>
          <Brand>
            <BrandLogo src={logo} alt="" />
            {title}
          </Brand>
          {topAside}
        </TopRow>
        {topExtra}
      </Top>
      <Scroll
        isBlurred={isBlurred}
        isProtected={isProtected}
        inert={isBackgroundInert}
      >
        <Paper>
          {children}
          <PageNumber>- 1 -</PageNumber>
        </Paper>
      </Scroll>
      <Bottom isBlurred={isBlurred} inert={isBackgroundInert}>
        <BottomLabel
          isAlert={isBottomAlert}
          role={isBottomAlert ? 'alert' : undefined}
        >
          {bottomLabel}
        </BottomLabel>
        <BottomButton
          type="button"
          onClick={onButtonClick}
          disabled={isButtonDisabled}
          data-keep-enter
        >
          {buttonLabel}
        </BottomButton>
      </Bottom>
      {overlay}
    </Container>
  );
};

export default ExamLayout;

const Container = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;

  background: ${LITERACY_COLORS.desk};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.serif};
  font-size: max(13px, 3.6cqw);

  inset: 0;
`;

const Top = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  padding: calc(5cqw + ${({ theme }) => theme.safeArea.top}) 4.5cqw 2.4cqw;
  border-bottom: 2px solid ${LITERACY_COLORS.ink};

  display: grid;
  gap: 2cqw;

  background: ${LITERACY_COLORS.paper};
  font-family: ${LITERACY_FONTS.head};
`;

const TopRow = styled.div`
  display: flex;
  gap: 2cqw;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.span`
  display: flex;
  gap: 1.4cqw;
  align-items: center;

  font: 700 3.1cqw ${LITERACY_FONTS.head};
`;

const BrandLogo = styled.img`
  width: 5cqw;
  height: 5cqw;
  border-radius: 1.4cqw;
`;

const Scroll = styled.div<{ isBlurred: boolean; isProtected: boolean }>`
  padding: 3cqw 2.6cqw 24cqw;

  flex: 1;

  filter: ${({ isBlurred }) => (isBlurred ? 'blur(16px)' : 'none')};
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-touch-callout: none;
  user-select: ${({ isProtected }) => (isProtected ? 'none' : 'auto')};

  img {
    pointer-events: none;
    -webkit-user-drag: none;
  }

  @media print {
    visibility: hidden;
  }
`;

const Paper = styled.div`
  padding: 5cqw 4.6cqw 6cqw;
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%);

  display: grid;
  gap: 6.4cqw;

  background: ${LITERACY_COLORS.paper};
`;

const PageNumber = styled.p`
  color: ${LITERACY_COLORS.sub};
  font: 700 3cqw ${LITERACY_FONTS.head};
  text-align: center;
`;

const Bottom = styled.div<{ isBlurred: boolean }>`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  padding: 3cqw 4.5cqw calc(4.6cqw + ${({ theme }) => theme.safeArea.bottom});
  border-top: 2px solid ${LITERACY_COLORS.ink};

  display: grid;
  gap: 3cqw;
  align-items: center;

  background: ${LITERACY_COLORS.paper};
  font-family: ${LITERACY_FONTS.head};

  filter: ${({ isBlurred }) => (isBlurred ? 'blur(16px)' : 'none')};
  grid-template-columns: auto 1fr;

  @media print {
    visibility: hidden;
  }
`;

const BottomLabel = styled.span<{ isAlert: boolean }>`
  color: ${({ isAlert }) => (isAlert ? LITERACY_COLORS.stamp : 'inherit')};
  font: 700 3.2cqw ${LITERACY_FONTS.head};

  word-break: keep-all;
`;

const BottomButton = styled.button`
  padding: 3.4cqw;
  border: 2px solid ${LITERACY_COLORS.ink};

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 700 max(14px, 3.8cqw) ${LITERACY_FONTS.head};
  letter-spacing: 0.1em;

  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`;
