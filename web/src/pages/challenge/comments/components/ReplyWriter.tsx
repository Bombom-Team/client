import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useAddCommentReplyMutation } from '../hooks/useAddCommentReplyMutation';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Text from '@/components/Text/Text';
import SendIcon from '#/assets/svg/send.svg';

interface ReplyWriterProps {
  challengeId: number;
  commentId: number;
}

const ReplyWriter = ({ challengeId, commentId }: ReplyWriterProps) => {
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const toggleReplyInput = () => {
    setIsReplyInputOpen((prev) => !prev);
  };

  const toggleIsPrivate = () => {
    setIsPrivate((prev) => !prev);
  };

  const { mutate: addCommentReply } = useAddCommentReplyMutation({
    challengeId,
    commentId,
  });

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    addCommentReply(
      { reply: replyText, isPrivate },
      {
        onSuccess: () => {
          setReplyText('');
          setIsPrivate(false);
          setIsReplyInputOpen(false);
        },
      },
    );
  };

  return (
    <>
      <ToggleButton variant="transparent" onClick={toggleReplyInput}>
        {isReplyInputOpen ? '답글 취소' : '답글 쓰기'}
      </ToggleButton>
      {isReplyInputOpen && (
        <InputWrapper>
          <Checkbox
            id={`private-reply-${commentId}`}
            checked={isPrivate}
            onChange={toggleIsPrivate}
          >
            <Text color="textTertiary" font="body2">
              비밀답글
            </Text>
          </Checkbox>
          <InputGroup>
            <Input
              placeholder="이 코멘트에 답글을 남겨보세요."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                  handleReplySubmit();
                }
              }}
            />
            <SubmitButton
              onClick={handleReplySubmit}
              disabled={!replyText.trim()}
            >
              <SendIcon
                width={20}
                height={20}
                fill={
                  replyText.trim()
                    ? theme.colors.white
                    : theme.colors.textTertiary
                }
              />
            </SubmitButton>
          </InputGroup>
        </InputWrapper>
      )}
    </>
  );
};

export default ReplyWriter;

const ToggleButton = styled(Button)`
  padding: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  text-decoration: underline;

  &:hover {
    background: none;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (width <= 400px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  flex: 1;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(Button)`
  padding: 8px;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.stroke};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
