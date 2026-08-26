import styled from '@emotion/styled';
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { faqsQueries } from '@/apis/faqs/faqs.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { FaqDetailView } from '@/pages/faqs/FaqDetailView';
import { type FaqCategoryType, FAQ_CATEGORY_LABELS } from '@/types/faq';

export const Route = createFileRoute('/_admin/faqs/$faqId/edit')({
  component: FaqEditPage,
});

const FAQ_CATEGORY_OPTIONS: { label: string; value: FaqCategoryType }[] =
  Object.entries(FAQ_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as FaqCategoryType,
  }));

function FaqEditPage() {
  const { faqId } = Route.useParams();
  const id = parseInt(faqId);

  const { data: faq } = useSuspenseQuery(faqsQueries.detail(id));

  if (!faq) return null;

  return <FaqEditForm faq={faq} id={id} />;
}

function FaqEditForm({
  faq,
  id,
}: {
  faq: {
    question: string;
    answer?: string;
    faqCategory: string;
    createdAt: string;
  };
  id: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer ?? '');
  const [faqCategory, setFaqCategory] = useState<FaqCategoryType>(
    faq.faqCategory as FaqCategoryType,
  );

  const [isPreview, setIsPreview] = useState(false);

  const { mutateAsync: updateFaqMutation, isPending } = useMutation({
    ...faqsQueries.mutation.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsQueries.all });
      queryClient.invalidateQueries({
        queryKey: faqsQueries.detail(id).queryKey,
      });
    },
  });

  const handleDisplayPreview = () => {
    if (!question.trim() || !answer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }
    setIsPreview(true);
  };

  const handleUpdate = async () => {
    try {
      await updateFaqMutation({
        faqId: id,
        payload: { question, answer, faqCategory },
      });
      navigate({
        to: '/faqs/$faqId',
        params: { faqId: id.toString() },
      });
    } catch (error) {
      let message = 'FAQ 수정에 실패했습니다.';
      if (error instanceof Error && error.message) {
        message += `\n${error.message}`;
      }
      alert(message);
    }
  };

  const handleCancel = () => {
    navigate({
      to: '/faqs/$faqId',
      params: { faqId: id.toString() },
    });
  };

  if (isPreview) {
    return (
      <Layout title="FAQ 수정 미리보기">
        <FaqDetailView
          faq={{
            id,
            question,
            answer,
            faqCategory,
            createdAt: faq.createdAt,
          }}
        >
          <ButtonGroup>
            <Button variant="secondary" onClick={() => setIsPreview(false)}>
              수정 계속하기
            </Button>
            <Button onClick={handleUpdate} disabled={isPending}>
              {isPending ? '게시 중...' : '게시'}
            </Button>
          </ButtonGroup>
        </FaqDetailView>
      </Layout>
    );
  }

  return (
    <Layout title="FAQ 수정">
      <Container>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleDisplayPreview();
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
            <Button type="submit">수정 완료</Button>
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
