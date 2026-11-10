import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { InquiryAvatar } from '@/pages/inquiries/InquiryAvatar';
import type { InquiryMessage } from '@/types/inquiry';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  // 문의자 메시지의 작성자 표시용 이름. 관리자 메시지에는 쓰지 않는다.
  senderName?: string;
  onEdit: (messageId: number, content: string) => void;
  onDelete: (messageId: number) => void;
}

export function InquiryMessageBubble({
  message,
  senderName,
  onEdit,
  onDelete,
}: InquiryMessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 수정 입력창을 내용 높이에 맞춰 늘린다. 긴 메시지를 좁은 칸에서 스크롤하며
  // 고치지 않도록, 말풍선과 비슷한 크기에서 바로 편집할 수 있게 한다.
  useEffect(() => {
    const textarea = editTextareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [editContent, isEditing]);
  const isAdminMessage = message.senderType === 'ADMIN';
  const sentAt = new Date(message.createdAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

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
      {/* 작성자 표시는 문의자 메시지에만 둔다. 관리자 메시지는 본문과 시각만 보여준다. */}
      {!isAdminMessage && senderName && (
        <InquiryAvatar name={senderName} size="sm" />
      )}
      <BubbleColumn $isAdmin={isAdminMessage} $isEditing={isEditing}>
        {!isAdminMessage && senderName && (
          <SenderLine>
            <SenderName>{senderName}</SenderName>
            <SenderTime>{sentAt}</SenderTime>
          </SenderLine>
        )}
        {isEditing ? (
          <EditForm>
            <EditTextarea
              ref={editTextareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <EditActions>
              <EditButton type="button" onClick={() => setIsEditing(false)}>
                취소
              </EditButton>
              <EditButton type="button" $primary onClick={handleSubmitEdit}>
                저장
              </EditButton>
            </EditActions>
          </EditForm>
        ) : (
          <BubbleWrapper>
            {/* 관리자 말풍선은 오른쪽 끝에 붙이고, 수정·삭제는 왼쪽에 띄운다. */}
            {isAdminMessage && (
              <BubbleActions data-bubble-actions>
                <ActionIcon
                  type="button"
                  aria-label="메시지 수정"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 size={14} />
                </ActionIcon>
                <ActionIcon
                  type="button"
                  aria-label="메시지 삭제"
                  onClick={handleDelete}
                >
                  <FiTrash2 size={14} />
                </ActionIcon>
              </BubbleActions>
            )}
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
          </BubbleWrapper>
        )}
        {/* 작성자 줄에 시각이 이미 있으면 아래에 반복하지 않는다. */}
        {(isAdminMessage || !senderName) && <BubbleTime>{sentAt}</BubbleTime>}
      </BubbleColumn>
    </BubbleRow>
  );
}

const BubbleRow = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin',
})<{ $isAdmin: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  justify-content: ${({ $isAdmin }) => ($isAdmin ? 'flex-end' : 'flex-start')};
`;

const SenderLine = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: baseline;
`;

const SenderName = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SenderTime = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

// 말풍선이 좁으면 어절 중간에서 줄이 자주 끊겨 읽기 불편하다. 어드민 답변은 보통
// 길어서 넉넉한 폭이 필요하고, 수정 중에는 더 넓혀 한눈에 보며 고칠 수 있게 한다.
const BubbleColumn = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin' && prop !== '$isEditing',
})<{ $isAdmin: boolean; $isEditing: boolean }>`
  width: ${({ $isEditing }) => ($isEditing ? '100%' : 'auto')};
  max-width: ${({ $isEditing }) => ($isEditing ? '90%' : '80%')};

  display: flex;
  flex-direction: column;
  align-items: ${({ $isAdmin }) => ($isAdmin ? 'flex-end' : 'flex-start')};
`;

const BubbleWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: flex-end;

  &:hover [data-bubble-actions] {
    opacity: 1;
  }
`;

// 회원 메시지는 타임라인 배경과 같은 색이라 말풍선 테두리 없이 본문만 흐른다.
// 관리자 메시지만 회색 말풍선으로 구분한다.
const Bubble = styled('div', {
  shouldForwardProp: (prop) => prop !== '$isAdmin',
})<{ $isAdmin: boolean }>`
  padding: ${({ $isAdmin, theme }) =>
    $isAdmin ? `${theme.spacing.sm} ${theme.spacing.md}` : '0'};

  /* 오른쪽에 붙는 관리자 말풍선은 그쪽 아래 모서리를 각지게 두어 보내는 방향을
     드러낸다. 말풍선 꼬리와 같은 역할이다. */
  border-radius: ${({ $isAdmin, theme }) =>
    $isAdmin
      ? `${theme.borderRadius.md} ${theme.borderRadius.md} 0 ${theme.borderRadius.md}`
      : theme.borderRadius.md};

  background-color: ${({ $isAdmin, theme }) =>
    $isAdmin ? theme.colors.gray100 : 'transparent'};
  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  white-space: pre-wrap;

  overflow-wrap: anywhere;

  /* 한글은 어절 단위로 끊어야 읽기 편하다. 다만 URL처럼 공백 없이 긴 문자열은
     넘치지 않도록 중간에서 끊는다. */
  word-break: keep-all;
`;

// 흐름에서 빼내 말풍선 왼쪽 바깥에 띄운다. 흐름 안에 두면 숨어 있을 때도 자리를
// 차지해 말풍선이 오른쪽 끝까지 붙지 못한다.
const BubbleActions = styled.div`
  position: absolute;
  right: 100%;
  bottom: 0;
  margin-right: ${({ theme }) => theme.spacing.xs};

  display: flex;
  gap: 2px;

  opacity: 0;
  transition: opacity 0.15s;

  &:focus-within {
    opacity: 1;
  }
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

// 말풍선과 같은 글자 크기·줄간격·패딩을 써서, 수정 중에도 완성된 모습과
// 비슷하게 보이도록 한다. 높이는 내용에 맞춰 스크립트가 조절한다.
const EditTextarea = styled.textarea`
  width: 100%;
  min-height: 60px;
  max-height: 480px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;

  overflow-y: auto;
  resize: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
`;

const EditButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$primary',
})<{ $primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: 1px solid
    ${({ $primary, theme }) =>
      $primary ? theme.colors.primary : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background-color: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.white};
  color: ${({ $primary, theme }) =>
    $primary ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};

  cursor: pointer;

  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ $primary, theme }) =>
      $primary ? theme.colors.primaryHover : theme.colors.gray50};
  }
`;
