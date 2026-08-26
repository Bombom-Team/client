import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { createFaq } from '@/apis/faqs/faqs.api';
import { faqsQueries } from '@/apis/faqs/faqs.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { type FaqCategoryType, FAQ_CATEGORY_LABELS } from '@/types/faq';

export const Route = createFileRoute('/_admin/faqs/new')({
  component: NewFaqPage,
});

const FAQ_CATEGORY_OPTIONS: { label: string; value: FaqCategoryType }[] =
  Object.entries(FAQ_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as FaqCategoryType,
  }));

function NewFaqPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState(
    FAQ_CATEGORY_OPTIONS[0]?.value ?? 'INTRODUCTION',
  );

  const queryClient = useQueryClient();
  const { mutateAsync: createFaqMutation, isPending } = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsQueries.all });
    },
  });

  const handleRegister = async () => {
    if (!question.trim() || !answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }

    try {
      await createFaqMutation({ question, answer, faqCategory });
      navigate({ to: '/faqs', search: { page: 0, size: 10 } });
    } catch (error) {
      let message = 'FAQ 등록에 실패했습니다. 잠시 후 다시 시도해주세요.';
      if (error instanceof Error && error.message) {
        message += `\n${error.message}`;
      }
      alert(message);
    }
  };

  const handleCancel = () => {
    if (!question.trim() && !answer.trim()) {
      navigate({ to: '/faqs', search: { page: 0, size: 10 } });
      return;
    }

    if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate({ to: '/faqs', search: { page: 0, size: 10 } });
    }
  };

  return (
    <Layout title="새 FAQ 작성">
      <Container>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <FormGroup>
            <Label htmlFor="category">카테고리</Label>
            <Select
              id="category"
              value={faqCategory}
              onChange={(e) =>
                setFaqCategory(e.target.value as FaqCategoryType)
              }
            >
              {FAQ_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="question">질문</Label>
            <Input
              id="question"
              type="text"
              placeholder="FAQ 질문을 입력하세요 (최대 75자)"
              value={question}
              maxLength={75}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="answer">답변</Label>
            <Textarea
              id="answer"
              placeholder="FAQ 답변을 입력하세요"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const FormGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
