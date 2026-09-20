import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { uploadInquiryImages } from '@/apis/inquiry/inquiry.api';
import Button from '@/components/Button/Button';
import { toast } from '@/components/Toast/utils/toastActions';
import type { ChangeEvent } from 'react';

const PhotoIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect
      x="2.5"
      y="3.75"
      width="15"
      height="12.5"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <circle cx="6.5" cy="7.5" r="1.25" fill={color} />
    <path
      d="M4 15l4.5-5 3 3.5 2-2.5 3.5 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface InquiryMessageInputProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  onSubmit: (body: { content?: string; imageUrls?: string[] }) => void;
}

const MAX_CONTENT_LENGTH = 500;
const MAX_IMAGE_COUNT = 4;

const InquiryMessageInput = ({
  disabled = false,
  isSubmitting = false,
  onSubmit,
}: InquiryMessageInputProps) => {
  const [content, setContent] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (imageUrls.length + files.length > MAX_IMAGE_COUNT) {
      toast.error(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const { imageUrls: uploadedUrls } = await uploadInquiryImages(files);
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => prev.filter((imageUrl) => imageUrl !== url));
  };

  const handleSubmit = () => {
    if (!content.trim() && imageUrls.length === 0) return;

    onSubmit({
      content: content.trim() || undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    });
    setContent('');
    setImageUrls([]);
  };

  return (
    <Container>
      {imageUrls.length > 0 && (
        <PreviewRow>
          {imageUrls.map((url) => (
            <PreviewImageWrapper key={url}>
              <PreviewImage src={url} alt="첨부 미리보기" />
              <RemoveButton
                type="button"
                onClick={() => handleRemoveImage(url)}
              >
                ×
              </RemoveButton>
            </PreviewImageWrapper>
          ))}
        </PreviewRow>
      )}

      <InputRow>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <TextareaWrapper>
          <Textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
            }
            placeholder="문의 내용을 입력해주세요"
            disabled={disabled}
          />
          <AttachButton
            type="button"
            aria-label="이미지 첨부"
            disabled={
              disabled || isUploading || imageUrls.length >= MAX_IMAGE_COUNT
            }
            onClick={() => fileInputRef.current?.click()}
          >
            <PhotoIcon color={theme.colors.textSecondary} />
          </AttachButton>
          <CharCount>
            {content.length} / {MAX_CONTENT_LENGTH}
          </CharCount>
        </TextareaWrapper>

        <Button
          onClick={handleSubmit}
          disabled={
            disabled ||
            isSubmitting ||
            isUploading ||
            (!content.trim() && imageUrls.length === 0)
          }
        >
          전송
        </Button>
      </InputRow>
    </Container>
  );
};

export default InquiryMessageInput;

const Container = styled.div`
  padding: 12px 16px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const AttachButton = styled.button`
  position: absolute;
  right: 12px;
  bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextareaWrapper = styled.div`
  position: relative;

  flex: 1;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 44px 20px 16px;
  border: none;
  border-radius: 22px;

  background: ${({ theme }) => theme.colors.dividers};
  font: ${({ theme }) => theme.fonts.t6Regular};

  resize: none;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
  }
`;

const CharCount = styled.span`
  position: absolute;
  bottom: 8px;
  left: 16px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};

  pointer-events: none;
`;

const PreviewRow = styled.div`
  display: flex;
  gap: 8px;
`;

const PreviewImageWrapper = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 8px;

  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
`;
