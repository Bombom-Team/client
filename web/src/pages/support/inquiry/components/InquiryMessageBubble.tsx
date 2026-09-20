import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useState } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { formatTimeToKorean } from '@/utils/date';
import type { InquiryMessage } from '@/types/inquiry';
import DeleteIcon from '#/assets/svg/delete.svg';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  isOwnMessage: boolean;
  isMobile: boolean;
  onDelete: (messageId: number) => void;
}

const InquiryMessageBubble = ({
  message,
  isOwnMessage,
  isMobile,
  onDelete,
}: InquiryMessageBubbleProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const handleImageClick = (url: string) => {
    setPreviewUrl(url);
    openModal();
  };

  return (
    <BubbleColumn isOwnMessage={isOwnMessage}>
      <BubbleRow isOwnMessage={isOwnMessage}>
        {isOwnMessage && (
          <ActionMenu>
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
          {message.content && <Content>{message.content}</Content>}
          {message.imageUrls.length > 0 && (
            <ImageGrid>
              {message.imageUrls.map((url) => (
                <ImageThumbnailButton
                  key={url}
                  type="button"
                  aria-label="첨부 이미지 크게 보기"
                  onClick={() => handleImageClick(url)}
                >
                  <ImageWithFallback
                    src={url}
                    alt="첨부 이미지"
                    width={140}
                    height={140}
                  />
                </ImageThumbnailButton>
              ))}
            </ImageGrid>
          )}
        </Bubble>
      </BubbleRow>

      <DateText isOwnMessage={isOwnMessage}>
        {formatTimeToKorean(new Date(message.createdAt))}
      </DateText>

      <Modal
        isOpen={isOpen}
        modalRef={modalRef}
        closeModal={closeModal}
        position="center"
      >
        {previewUrl && (
          <PreviewImage src={previewUrl} alt="첨부 이미지 크게 보기" />
        )}
      </Modal>
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

const Bubble = styled.div<{
  isOwnMessage: boolean;
  isMobile: boolean;
}>`
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
  gap: 8px;
  flex-wrap: wrap;
`;

const ImageThumbnailButton = styled.button`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: block;

  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  img {
    display: block;

    object-fit: cover;
  }
`;

const PreviewImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 12px;

  object-fit: contain;
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
