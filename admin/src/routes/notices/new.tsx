import styled from '@emotion/styled';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { useNotices } from '@/contexts/NoticeContext';

export const Route = createFileRoute('/notices/new')({
  component: NewNoticePage,
});

function NewNoticePage() {
  const navigate = useNavigate();
  const { createNotice } = useNotices();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    createNotice(title, content);
    navigate({ to: '/notices' });
  };

  const handleCancel = () => {
    if (!title.trim() && !content.trim()) {
      navigate({ to: '/notices' });
      return;
    }

    if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      navigate({ to: '/notices' });
    }
  };

  return (
    <Layout title="새 공지사항 작성">
      <Container>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="공지사항 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="공지사항 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              취소
            </Button>
            <Button type="submit">등록</Button>
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
