import styled from '@emotion/styled';
import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { InquiryMessage } from '@/types/inquiry';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

export function InquiryMessageBubble({
  message,
  onEdit,
  onDelete,
}: InquiryMessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const isAdminMessage = message.senderType === 'ADMIN';

  const handleSubmitEdit = () => {
    const trimmed = editContent.trim();
    if (!trimmed) {
      alert('내용을 입력해주세요.');
      return;
    }
    onEdit(message.id, trimmed);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!confirm('메시지를 삭제하시겠습니까?')) {
      return;
    }
    onDelete(message.id);
  };

  return (
    <BubbleRow $isAdmin={isAdminMessage}>
      <BubbleColumn $isAdmin={isAdminMessage}>
        {isEditing ? (
          <EditForm>
            <EditTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <EditActions>
              <button type="button" onClick={() => setIsEditing(false)}>
                취소
              </button>
              <button type="button" onClick={handleSubmitEdit}>
                저장
              </button>
            </EditActions>
          </EditForm>
        ) : (
          <BubbleWrapper>
            <Bubble $isAdmin={isAdminMessage}>
              {message.content}
              {message.imageUrls.length > 0 && (
                <ImageGrid>
                  {message.imageUrls.map((url) => (
                    <MessageImage key={url} src={url} alt="첨부 이미지" />
                  ))}
                </ImageGrid>
              )}
            </Bubble>
            {isAdminMessage && (
              <BubbleActions data-bubble-actions>
                <ActionIcon onClick={() => setIsEditing(true)}>
                  <FiEdit2 size={14} />
                </ActionIcon>
                <ActionIcon onClick={handleDelete}>
                  <FiTrash2 size={14} />
                </ActionIcon>
              </BubbleActions>
            )}
          </BubbleWrapper>
        )}
        <BubbleTime>
          {new Date(message.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </BubbleTime>
      </BubbleColumn>
    </BubbleRow>
  );
}

const BubbleRow = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin',
})<{ $isAdmin: boolean }>`
  display: flex;
  justify-content: ${({ $isAdmin }) => ($isAdmin ? 'flex-end' : 'flex-start')};
`;

const BubbleColumn = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin',
})<{ $isAdmin: boolean }>`
  max-width: 60%;

  display: flex;
  flex-direction: column;
  align-items: ${({ $isAdmin }) => ($isAdmin ? 'flex-end' : 'flex-start')};
`;

const BubbleWrapper = styled.div`
  position: relative;

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: flex-end;

  &:hover [data-bubble-actions] {
    opacity: 1;
  }
`;

const Bubble = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin',
})<{ $isAdmin: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ $isAdmin, theme }) =>
    $isAdmin ? theme.colors.primary : theme.colors.gray100};
  color: ${({ $isAdmin, theme }) =>
    $isAdmin ? theme.colors.white : theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: pre-wrap;
  word-break: break-word;
`;

const BubbleActions = styled.div`
  display: flex;
  gap: 2px;

  opacity: 0;
  transition: opacity 0.15s;
`;

const ActionIcon = styled.button`
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;

const BubbleTime = styled.span`
  margin-top: 2px;

  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ImageGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const MessageImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  object-fit: cover;
`;

const EditForm = styled.div`
  width: 100%;

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const EditTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  min-height: 60px;

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;

  button {
    padding: 4px 8px;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    background-color: ${({ theme }) => theme.colors.gray100};

    cursor: pointer;
    font-size: 12px;
  }
`;
