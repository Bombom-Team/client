import styled from '@emotion/styled';
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { noticesQueries } from '@/apis/notices/notices.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { NoticeDetailView } from '@/pages/notices/NoticeDetailView';
import {
  type NoticeCategoryType,
  NOTICE_CATEGORY_LABELS,
} from '@/types/notice';

export const Route = createFileRoute('/_admin/notices/$noticeId/edit')({
  component: NoticeEditPage,
});

const NOTICE_CATEGORY_OPTIONS: { label: string; value: NoticeCategoryType }[] =
  Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as NoticeCategoryType,
  }));

function NoticeEditPage() {
  const { noticeId } = Route.useParams();
  const id = parseInt(noticeId);

  // Load existing data
  const { data: notice } = useSuspenseQuery(noticesQueries.detail(id));

  if (!notice) return null;

  return <NoticeEditForm notice={notice} id={id} />;
}

function NoticeEditForm({
  notice,
  id,
}: {
  notice: {
    title: string;
    content?: string;
    noticeCategory: NoticeCategoryType;
    createdAt: string;
  };
  id: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(notice.title);
  const [content, setContent] = useState(notice.content ?? '');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategoryType>(
    notice.noticeCategory,
  );

  const [isPreview, setIsPreview] = useState(false);

  const { mutateAsync: updateNoticeMutation, isPending } = useMutation({
    ...noticesQueries.mutation.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueries.all });
      queryClient.invalidateQueries({
        queryKey: noticesQueries.detail(id).queryKey,
      });
    },
  });

  const handleDisplayPreview = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setIsPreview(true);
  };

  const handleUpdate = async () => {
    try {
      await updateNoticeMutation({
        noticeId: id,
        payload: { title, content, noticeCategory },
      });
      navigate({
        to: '/notices/$noticeId',
        params: { noticeId: id.toString() },
      });
    } catch (error) {
      let message = '공지사항 수정에 실패했습니다.';
      if (error instanceof Error && error.message) {
        message += `\n${error.message}`;
      }
      alert(message);
    }
  };

  const handleCancel = () => {
    navigate({
      to: '/notices/$noticeId',
      params: { noticeId: id.toString() },
    });
  };

  if (isPreview) {
    return (
      <Layout title="공지사항 수정 미리보기">
        <NoticeDetailView
          notice={{
            id,
            title,
            content,
            noticeCategory,
            createdAt: notice.createdAt, // Keep original date or show 'Now'? Keeping original seems safer for edit
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
        </NoticeDetailView>
      </Layout>
    );
  }

  return (
    <Layout title="공지사항 수정">
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
              value={noticeCategory}
              onChange={(e) =>
                setNoticeCategory(e.target.value as NoticeCategoryType)
              }
            >
              {NOTICE_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormGroup>

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
