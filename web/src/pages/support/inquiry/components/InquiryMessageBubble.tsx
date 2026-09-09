import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import type { InquiryMessage } from '@/types/inquiry';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  isOwnMessage: boolean;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

const InquiryMessageBubble = ({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
}: InquiryMessageBubbleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const handleSubmitEdit = () => {
    onEdit(message.id, editValue);
    setIsEditing(false);
  };

  return (
    <BubbleRow isOwnMessage={isOwnMessage}>
      <Bubble isOwnMessage={isOwnMessage}>
        {isEditing ? (
          <EditWrapper>
            <EditTextarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              maxLength={500}
            />
            <Button onClick={handleSubmitEdit}>저장</Button>
            <Button variant="transparent" onClick={() => setIsEditing(false)}>
              취소
            </Button>
          </EditWrapper>
        ) : (
          <>
            {message.content && <Content>{message.content}</Content>}
            {message.imageUrls.length > 0 && (
              <ImageGrid>
                {message.imageUrls.map((url) => (
                  <ImageWithFallback
                    key={url}
                    src={url}
                    alt="첨부 이미지"
                    width={96}
                    height={96}
                  />
                ))}
              </ImageGrid>
            )}
          </>
        )}
      </Bubble>

      {isOwnMessage && !isEditing && (
        <ActionMenu>
          <ActionButton type="button" onClick={() => setIsEditing(true)}>
            수정
          </ActionButton>
          <ActionButton type="button" onClick={() => onDelete(message.id)}>
            삭제
          </ActionButton>
        </ActionMenu>
      )}
    </BubbleRow>
  );
};

export default InquiryMessageBubble;

const BubbleRow = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  gap: 8px;
  align-items: flex-end;
  justify-content: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const Bubble = styled.div<{ isOwnMessage: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;

  background: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.colors.primaryBomBom : theme.colors.dividers};
  color: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Content = styled.p`
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const ImageGrid = styled.div`
  margin-top: 8px;

  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const ActionMenu = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const ActionButton = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const EditWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t6Regular};
`;
