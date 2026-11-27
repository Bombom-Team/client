import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { uploadInquiryImages } from '@/apis/inquiries/inquiryMessages.api';
import { useSendInquiryMessageMutation } from '@/apis/inquiries/inquiryMessages.query';

const MAX_CONTENT_LENGTH = 500;
const MAX_IMAGE_COUNT = 4;

interface InquiryMessageInputProps {
  roomId: number;
  disabled: boolean;
}

interface UploadedImage {
  url: string;
  previewUrl: string;
}

export function InquiryMessageInput({
  roomId,
  disabled,
}: InquiryMessageInputProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [content]);

  const { mutate: sendMessage, isPending: isSending } =
    useSendInquiryMessageMutation();

  const uploadImages = async (files: File[]) => {
    if (images.length + files.length > MAX_IMAGE_COUNT) {
      alert(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 첨부할 수 있습니다.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrls = await uploadInquiryImages(files);
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [
        ...prev,
        ...uploadedUrls.map((url, i) => ({
          url,
          previewUrl: previewUrls[i],
        })),
      ]);
    } catch (error) {
      alert(
        error instanceof Error
          ? `이미지 업로드 실패: ${error.message}`
          : '이미지 업로드에 실패했습니다.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    await uploadImages(files);
  };

  // 스크린샷처럼 이미지만 담긴 클립보드는 첨부로 올린다. 엑셀·워드에서 복사하면
  // 텍스트와 함께 미리보기 이미지가 실려 오므로, 텍스트가 있으면 평소처럼 글로 붙인다.
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData.getData('text/plain')) return;

    const imageFiles = Array.from(e.clipboardData.files).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (imageFiles.length === 0) return;

    e.preventDefault();
    // 전송이 끝나면 첨부 목록을 비우므로, 전송 중에 붙인 이미지는 보내지지 않고 사라진다.
    // 조용히 버리면 첨부된 줄 알고 보낼 수 있어 다시 붙여넣도록 알린다.
    if (isUploading || isSending) {
      alert('이미지 업로드나 전송이 끝난 뒤 다시 붙여넣어 주세요.');
      return;
    }

    await uploadImages(imageFiles);
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image.url !== url));
  };

  const handleSend = () => {
    // 업로드가 끝나기 전에 보내면 그 이미지는 빠진 채 전송되고, 전송 완료 시 첨부 목록을
    // 비우면서 사라진다. 전송 버튼과 같은 조건으로 Enter 전송도 막는다.
    if (isSending || isUploading) return;

    const trimmed = content.trim();
    if (!trimmed) {
      alert('메시지 내용을 입력해주세요.');
      return;
    }

    sendMessage(
      {
        roomId,
        content: trimmed,
        imageUrls: images.map((image) => image.url),
      },
      {
        onSuccess: () => {
          setContent('');
          setImages([]);
        },
        onError: (error) => {
          alert(`메시지 전송 실패: ${error.message}`);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputContainer>
      {images.length > 0 && (
        <ImagePreviewRow>
          {images.map((image) => (
            <ImagePreviewItem key={image.url}>
              <PreviewImg src={image.previewUrl} alt="첨부 미리보기" />
              <RemoveButton
                type="button"
                onClick={() => handleRemoveImage(image.url)}
              >
                <FiX size={12} />
              </RemoveButton>
            </ImagePreviewItem>
          ))}
        </ImagePreviewRow>
      )}
      <InputRow>
        <AttachButton
          type="button"
          aria-label="이미지 첨부"
          disabled={
            disabled ||
            isUploading ||
            isSending ||
            images.length >= MAX_IMAGE_COUNT
          }
          onClick={() => fileInputRef.current?.click()}
        >
          <FiPaperclip size={18} />
        </AttachButton>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        <MessageTextarea
          ref={textareaRef}
          value={content}
          onChange={(e) =>
            setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
          }
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={disabled ? '종료된 문의입니다' : '메시지를 입력하세요'}
          title="Enter로 전송, Shift+Enter로 줄바꿈"
          disabled={disabled}
          rows={1}
        />
        <SendButton
          type="button"
          aria-label={isSending ? '전송 중' : '전송'}
          disabled={disabled || isSending || isUploading}
          onClick={handleSend}
        >
          <FiSend size={16} />
        </SendButton>
      </InputRow>
      {/* 빈 입력창 아래 0 / 500이 떠 있으면 시선만 끌어 입력 전에는 감춘다. 다만
          자리는 늘 차지하게 두어 첫 글자를 칠 때 입력창이 밀려 올라가지 않게 한다. */}
      <CharCount $visible={content.length > 0}>
        {content.length} / {MAX_CONTENT_LENGTH}
      </CharCount>
    </InputContainer>
  );
}

const InputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ImagePreviewRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ theme }) => theme.spacing.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ImagePreviewItem = styled.div`
  position: relative;
`;

const PreviewImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;
`;

// 첨부·입력·전송을 테두리 하나로 묶어 한 덩어리로 보이게 한다. 내부 요소는
// 각자 테두리를 갖지 않고, 포커스 표시도 이 컨테이너가 대신 받는다.
const InputRow = styled.div`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  transition: border-color 0.15s;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AttachButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray400};

  cursor: pointer;

  transition: background-color 0.15s, color 0.15s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const MessageTextarea = styled.textarea`
  min-height: 24px;
  max-height: 200px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: none;

  flex: 1;

  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray900};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;

  overflow-y: auto;
  resize: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const CharCount = styled('p', {
  shouldForwardProp: (prop) => prop !== '$visible',
})<{ $visible: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-right: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: right;

  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;
