import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import { uploadInquiryImages } from '@/apis/inquiries/inquiryMessages.api';
import { useSendInquiryMessageMutation } from '@/apis/inquiries/inquiryMessages.query';

const MAX_IMAGE_COUNT = 4;

interface InquiryMessageInputProps {
  roomId: number;
  disabled: boolean;
  onSent: () => void;
}

interface UploadedImage {
  url: string;
  previewUrl: string;
}

export function InquiryMessageInput({
  roomId,
  disabled,
  onSent,
}: InquiryMessageInputProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate: sendMessage, isPending: isSending } =
    useSendInquiryMessageMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

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

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((image) => image.url !== url));
  };

  const handleSend = () => {
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
          onSent();
        },
        onError: (error) => {
          alert(`메시지 전송 실패: ${error.message}`);
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
          disabled={disabled || isUploading || images.length >= MAX_IMAGE_COUNT}
          onClick={() => fileInputRef.current?.click()}
        >
          <FiImage size={18} />
        </AttachButton>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        <MessageTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? '종료된 문의입니다.' : '메시지를 입력하세요'}
          disabled={disabled}
        />
        <SendButton
          type="button"
          disabled={disabled || isSending || isUploading}
          onClick={handleSend}
        >
          <FiSend size={18} />
        </SendButton>
      </InputRow>
    </InputContainer>
  );
}

const InputContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ImagePreviewRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

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

const InputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
`;

const AttachButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray600};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const MessageTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex: 1;
  min-height: 40px;
  max-height: 120px;

  font-size: ${({ theme }) => theme.fontSize.sm};
  resize: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray50};
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

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
