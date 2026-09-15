import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { formatTimeToKorean } from '@/utils/date';
import type { InquiryMessage } from '@/types/inquiry';
import DeleteIcon from '#/assets/svg/delete.svg';
import EditIcon from '#/assets/svg/edit.svg';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  isOwnMessage: boolean;
  isMobile: boolean;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

const InquiryMessageBubble = ({
  message,
  isOwnMessage,
  isMobile,
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
    <BubbleColumn isOwnMessage={isOwnMessage}>
      <BubbleRow isOwnMessage={isOwnMessage}>
        {isOwnMessage && !isEditing && (
          <ActionMenu>
            <ActionButton
              type="button"
              aria-label="메시지 수정"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon
                fill={theme.colors.textSecondary}
                width={16}
                height={16}
              />
            </ActionButton>
            <ActionButton
              type="button"
              aria-label="메시지 삭제"
              onClick={() => {
                if (window.confirm('메시지를 삭제할까요?')) {
                  onDelete(message.id);
                }
              }}
            >
              <DeleteIcon
                fill={theme.colors.textSecondary}
                width={16}
                height={16}
              />
            </ActionButton>
          </ActionMenu>
        )}

        <Bubble isOwnMessage={isOwnMessage} isMobile={isMobile}>
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
      </BubbleRow>

      <DateText isOwnMessage={isOwnMessage}>
        {formatTimeToKorean(new Date(message.createdAt))}
      </DateText>
    </BubbleColumn>
  );
};

export default InquiryMessageBubble;

const BubbleColumn = styled.div<{ isOwnMessage: boolean }>`
  width: 100%;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const BubbleRow = styled.div<{ isOwnMessage: boolean }>`
  width: 100%;

  display: flex;
  gap: 8px;
  align-items: flex-end;
  justify-content: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const Bubble = styled.div<{ isOwnMessage: boolean; isMobile: boolean }>`
  flex-shrink: 0;
  width: fit-content;
  max-width: ${({ isMobile }) => (isMobile ? 'calc(100% - 60px)' : '520px')};
  padding: 12px 16px;
  border-radius: 16px;

  background: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.colors.primaryBomBom : theme.colors.dividers};
  color: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Content = styled.p`
  margin: 0;

  white-space: pre-wrap;
  word-break: break-all;
`;

const ImageGrid = styled.div`
  margin-top: 8px;

  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const ActionMenu = styled.div`
  flex-shrink: 0;

  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dividers};
  }
`;

const DateText = styled.span<{ isOwnMessage: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};
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
