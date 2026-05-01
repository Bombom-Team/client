import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { getMaeilMailAnswerUrl } from '../../constants/maeilMail';
import { useMaeilMailAnswerMutation } from '../../hooks/useMaeilMailAnswerMutation';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { toast } from '@/components/Toast/utils/toastActions';
import { useDevice } from '@/hooks/useDevice';
import type { ChangeEvent } from 'react';

interface MaeilMailAnswerModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  onClose: () => void;
  articleId: number;
}

const MaeilMailAnswerModal = ({
  modalRef,
  isOpen,
  onClose,
  articleId,
}: MaeilMailAnswerModalProps) => {
  const [answer, setAnswer] = useState('');
  const device = useDevice();
  const navigate = useNavigate();

  const { data: content } = useQuery({
    ...queries.contentByArticleId({ articleId }),
    enabled: isOpen,
  });
  const contentId = content?.contentId;

  const { data: submittedAnswer } = useQuery({
    ...queries.answerByArticleId({ articleId }),
    enabled: isOpen,
  });
  const hasSubmittedAnswer = typeof submittedAnswer === 'string';

  const { mutate: submitAnswer, isPending: isSubmitting } =
    useMaeilMailAnswerMutation();

  const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const handleViewAnswerClick = () => {
    if (contentId === undefined) {
      toast.error('정답 페이지로 이동할 수 없어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    navigate({ href: getMaeilMailAnswerUrl(contentId, articleId) });
  };

  const handleSubmitClick = () => {
    if (contentId === undefined) {
      toast.error('답변 제출에 실패했어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    submitAnswer(
      { articleId, answer },
      {
        onSuccess: () => {
          navigate({ href: getMaeilMailAnswerUrl(contentId, articleId) });
        },
        onError: () => {
          toast.error('답변 제출에 실패했어요. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  };

  const textareaValue = hasSubmittedAnswer ? submittedAnswer : answer;
  const isSubmitDisabled = answer.length === 0 || isSubmitting;

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={onClose}
      position={device === 'mobile' ? 'bottom' : 'center'}
    >
      <Container>
        <Title>내 답변 작성</Title>
        <Field>
          <Label htmlFor="maeil-mail-answer">내 답변</Label>
          <Textarea
            id="maeil-mail-answer"
            value={textareaValue}
            onChange={handleAnswerChange}
            placeholder="생각나는 대로 적어도 괜찮아요"
            disabled={hasSubmittedAnswer}
          />
          <CharacterCount>{textareaValue.length}자</CharacterCount>
        </Field>
        <ButtonRow>
          <ViewAnswerButton type="button" onClick={handleViewAnswerClick}>
            바로 정답 보기
          </ViewAnswerButton>
          {!hasSubmittedAnswer && (
            <SubmitButton
              variant="filled"
              onClick={handleSubmitClick}
              disabled={isSubmitDisabled}
            >
              제출하고 정답 보기
            </SubmitButton>
          )}
        </ButtonRow>
      </Container>
    </Modal>
  );
};

export default MaeilMailAnswerModal;

const Container = styled.div`
  width: 720px;
  max-width: 100%;
  padding: 8px 0 0;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const Field = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const Textarea = styled.textarea`
  min-height: 160px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};

  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.textSecondary};

    cursor: not-allowed;
    resize: none;
  }
`;

const CharacterCount = styled.p`
  margin-left: auto;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ViewAnswerButton = styled.button`
  padding: 8px 4px;
  border: none;

  background: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SubmitButton = styled(Button)`
  height: 48px;
  border-radius: 24px;

  flex: 1;

  font: ${({ theme }) => theme.fonts.t6Regular};
`;
