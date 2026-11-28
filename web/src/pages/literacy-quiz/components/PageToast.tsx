import styled from '@emotion/styled';
import { FADE_IN } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';

interface PageToastProps {
  message: string;
}

// 결과 마지막 장의 아래 고정 버튼(도전장 보내기·문제와 해설 보기) 바로 위에 뜨는 검은 토스트
const PageToast = ({ message }: PageToastProps) => {
  return <Container role="status">{message}</Container>;
};

export default PageToast;

const Container = styled.div`
  position: absolute;
  bottom: calc(24cqw + ${({ theme }) => theme.safeArea.bottom});
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  width: max-content;
  max-width: calc(100% - 32px);
  padding: 10px 16px;
  border-radius: 10px;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 500 13.5px ${LITERACY_FONTS.head};
  text-align: center;

  animation: ${FADE_IN} 0.2s both;

  pointer-events: none;
  transform: translateX(-50%);
  word-break: keep-all;
`;
