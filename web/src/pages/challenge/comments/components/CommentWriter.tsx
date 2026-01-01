import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';

interface CommentWriterProps {
  comment: string;
  onCommentChange: (value: string) => void;
  minLength: number;
}

const CommentWriter = ({
  comment,
  onCommentChange,
  minLength,
}: CommentWriterProps) => {
  const device = useDevice();

  return (
    <Container>
      <Title isMobile={device === 'mobile'}>코멘트 작성</Title>
      <TextArea
        isMobile={device === 'mobile'}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="느낀 점, 감상평, 인상 깊었던 내용 등을 자유롭게 적어주세요."
      />
      <MinLengthMessage
        isMobile={device === 'mobile'}
        isError={comment.length > 0 && comment.length < minLength}
      >
        최소 {minLength}자 이상 입력해주세요 ({comment.length}/{minLength})
      </MinLengthMessage>
    </Container>
  );
};

export default CommentWriter;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const TextArea = styled.textarea<{ isMobile: boolean }>`
  min-height: ${({ isMobile }) => (isMobile ? '80px' : '120px')};
  padding: ${({ isMobile }) => (isMobile ? '8px' : '16px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};

  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const MinLengthMessage = styled.p<{ isMobile: boolean; isError: boolean }>`
  color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body4 : theme.fonts.body3};
  text-align: right;
`;
