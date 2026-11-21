import { theme } from '@bombom/shared';
import { Modal, useModal } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useState } from 'react';
import InquiryMessageDeleteModal from './InquiryMessageDeleteModal';
import { ADMIN_FALLBACK_NAME } from '../constants/inquiry';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { formatTimeToKorean } from '@/utils/date';
import type { InquiryMessage } from '@/types/inquiry';
import CloseIcon from '#/assets/svg/close.svg';
import DeleteIcon from '#/assets/svg/delete.svg';
import HeadsetIcon from '#/assets/svg/headset.svg';

interface InquiryMessageBubbleProps {
  message: InquiryMessage;
  isOwnMessage: boolean;
  isMobile: boolean;
  isDeletePending: boolean;
  onDelete: (messageId: number) => void;
}

const InquiryMessageBubble = ({
  message,
  isOwnMessage,
  isMobile,
  isDeletePending,
  onDelete,
}: InquiryMessageBubbleProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { modalRef, isOpen, openModal, closeModal } = useModal();
  const {
    modalRef: previewModalRef,
    isOpen: isPreviewOpen,
    openModal: openPreviewModal,
    closeModal: closePreviewModal,
  } = useModal({
    scrollLock: previewUrl !== null,
    onClose: () => setPreviewUrl(null),
  });

  const imageUrls = message.imageUrls ?? [];
  const senderName = message.adminNickname ?? ADMIN_FALLBACK_NAME;

  const handleDeleteClick = () => {
    openModal();
  };

  const handleConfirmDelete = () => {
    if (message.id != null) {
      onDelete(message.id);
    }
  };

  const handleImageClick = (url: string) => {
    setPreviewUrl(url);
    openPreviewModal();
  };

  return (
    <BubbleColumn isOwnMessage={isOwnMessage}>
      {!isOwnMessage && (
        <SenderRow>
          <SenderName>{senderName}</SenderName>
          <HeadsetIcon
            width={16}
            height={16}
            color={theme.colors.primaryBomBom}
            aria-label="봄봄 운영팀"
          />
          <SentTime>
            {formatTimeToKorean(new Date(message.createdAt ?? ''))}
          </SentTime>
        </SenderRow>
      )}

      <BubbleRow isOwnMessage={isOwnMessage}>
        {isOwnMessage && (
          <ActionMenu>
            <ActionButton
              type="button"
              aria-label="메시지 삭제"
              disabled={isDeletePending}
              aria-busy={isDeletePending}
              onClick={handleDeleteClick}
            >
              <DeleteIcon
                fill={theme.colors.textSecondary}
                width={16}
                height={16}
              />
            </ActionButton>
          </ActionMenu>
        )}

        <Bubble
          hasImages={imageUrls.length > 0}
          isOwnMessage={isOwnMessage}
          isMobile={isMobile}
        >
          {message.content && <Content>{message.content}</Content>}
          {imageUrls.length > 0 && (
            <ImageGrid>
              {imageUrls.map((url) => (
                <ImageThumbnailButton
                  key={url}
                  type="button"
                  aria-label="첨부 이미지 크게 보기"
                  onClick={() => handleImageClick(url)}
                >
                  <ImageWithFallback
                    src={url}
                    alt="첨부 이미지"
                    width={240}
                    height={240}
                  />
                </ImageThumbnailButton>
              ))}
            </ImageGrid>
          )}
        </Bubble>
      </BubbleRow>

      {isOwnMessage && (
        <DateText>
          {formatTimeToKorean(new Date(message.createdAt ?? ''))}
        </DateText>
      )}

      <Modal
        isOpen={isPreviewOpen}
        modalRef={previewModalRef}
        closeModal={closePreviewModal}
        position="fullscreen"
        showBackdrop={false}
        showCloseButton={false}
      >
        {previewUrl && (
          <PreviewBackdrop>
            <PreviewCloseButton
              type="button"
              aria-label="이미지 미리보기 닫기"
              onClick={closePreviewModal}
            >
              <CloseIcon fill={theme.colors.white} width={24} height={24} />
            </PreviewCloseButton>
            <PreviewImage src={previewUrl} alt="첨부 이미지 크게 보기" />
          </PreviewBackdrop>
        )}
      </Modal>

      <InquiryMessageDeleteModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        onDelete={handleConfirmDelete}
      />
    </BubbleColumn>
  );
};

export default InquiryMessageBubble;

const BubbleColumn = styled.div<{ isOwnMessage: boolean }>`
  width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

const BubbleRow = styled.div<{ isOwnMessage: boolean }>`
  width: 100%;

  display: flex;
  gap: 4px;
  align-items: flex-end;
  justify-content: ${({ isOwnMessage }) =>
    isOwnMessage ? 'flex-end' : 'flex-start'};
`;

/**
 * 말풍선이 향하는 쪽 아래 모서리만 각지게 해 보낸 사람 방향을 드러낸다.
 */
const Bubble = styled.div<{
  hasImages: boolean;
  isOwnMessage: boolean;
  isMobile: boolean;
}>`
  width: ${({ hasImages }) => (hasImages ? '272px' : 'fit-content')};

  /* 어드민 답변은 길어지기 쉬워 폭을 넓게 쓰되, 반대편 끝에 닿지 않도록 여백을 남긴다 */
  max-width: ${({ isOwnMessage, isMobile }) => {
    if (!isOwnMessage) return 'calc(100% - 80px)';
    return isMobile ? 'calc(100% - 60px)' : '520px';
  }};
  padding: 12px 16px;
  border-radius: ${({ isOwnMessage }) =>
    isOwnMessage ? '16px 16px 0' : '16px 16px 16px 0'};

  flex-shrink: 0;

  background: ${({ isOwnMessage, theme }) =>
    isOwnMessage ? theme.colors.primaryInfo : theme.colors.dividers};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};

  box-sizing: border-box;
`;

const Content = styled.p`
  margin: 0;

  white-space: pre-wrap;

  word-break: break-all;
`;

const ImageGrid = styled.div`
  width: 100%;
  margin-top: 8px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const ImageThumbnailButton = styled.button`
  overflow: hidden;
  width: 100%;
  max-width: 240px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: block;

  aspect-ratio: 1;

  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }

  img {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;
  }
`;

const PreviewBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(0 0 0 / 90%);
`;

const PreviewCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;

  object-fit: contain;
`;

const ActionMenu = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  padding: 4px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.dividers};
  }
`;

const SenderRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const SenderName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const SentTime = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};
`;
