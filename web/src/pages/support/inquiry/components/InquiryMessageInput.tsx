import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { uploadInquiryImages } from '@/apis/inquiry/inquiry.api';
import Button from '@/components/Button/Button';
import { toast } from '@/components/Toast/utils/toastActions';
import type { ChangeEvent } from 'react';

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
        <AttachButton
          type="button"
          disabled={
            disabled || isUploading || imageUrls.length >= MAX_IMAGE_COUNT
          }
          onClick={() => fileInputRef.current?.click()}
        >
          +
        </AttachButton>
        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <Textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))
          }
          placeholder="문의 내용을 입력해주세요"
          disabled={disabled}
        />

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

      <CharCount>
        {content.length} / {MAX_CONTENT_LENGTH}
      </CharCount>
    </Container>
  );
};

export default InquiryMessageInput;

const Container = styled.div`
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.stroke};

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
  width: 36px;
  height: 36px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.dividers};
  font: ${({ theme }) => theme.fonts.t6Bold};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const Textarea = styled.textarea`
  min-height: 36px;
  max-height: 120px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  flex: 1;

  font: ${({ theme }) => theme.fonts.t6Regular};

  resize: none;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
  }
`;

const CharCount = styled.span`
  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
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
