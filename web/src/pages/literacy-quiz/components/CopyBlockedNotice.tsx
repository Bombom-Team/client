import styled from '@emotion/styled';
import { FADE_IN } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';

type NoticeSize = 'mobile' | 'pc';

interface CopyBlockedNoticeProps {
  message: string;
  size: NoticeSize;
}

const CopyBlockedNotice = ({ message, size }: CopyBlockedNoticeProps) => {
  return (
    <Container size={size} role="status">
      {message}
    </Container>
  );
};

export default CopyBlockedNotice;

const SIZE_STYLES = {
  mobile: {
    padding: '2.4cqw 4.4cqw',
    font: 'max(13px, 3.4cqw)',
    radius: '2cqw',
  },
  pc: { padding: '10px 18px', font: '15px', radius: '8px' },
};

const Container = styled.div<{ size: NoticeSize }>`
  position: absolute;
  top: 34%;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  padding: ${({ size }) => SIZE_STYLES[size].padding};
  border-radius: ${({ size }) => SIZE_STYLES[size].radius};

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 600 ${({ size }) => SIZE_STYLES[size].font} ${LITERACY_FONTS.head};
  white-space: nowrap;

  animation: ${FADE_IN} 0.2s both;

  pointer-events: none;
  transform: translateX(-50%);
`;
