import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useCreateNewsletter } from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  NEWSLETTER_CATEGORY_LABELS,
  type NewsletterCategoryType,
} from '@/types/newsletter';

export const Route = createFileRoute('/_admin/newsletters/new')({
  component: NewsletterCreatePage,
});

function NewsletterCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: createNewsletter, isPending } = useCreateNewsletter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    email: '',
    category: '' as NewsletterCategoryType | '',
    mainPageUrl: '',
    subscribeUrl: '',
    issueCycle: '',
    sender: '',
    previousNewsletterUrl: '',
    subscribeMethod: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    createNewsletter(
      {
        ...formData,
        category: formData.category as string,
      },
      {
        onSuccess: () => {
          alert('뉴스레터가 성공적으로 등록되었습니다.');
          queryClient.invalidateQueries({ queryKey: ['newsletters'] });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          navigate({ to: '/newsletters' } as any);
        },
        onError: (error) => {
          alert(`등록 실패: ${error.message}`);
        },
      },
    );
  };

  return (
    <Layout title="뉴스레터 등록">
      <Container>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>기본 정보</SectionTitle>
            <FormGroup>
              <Label required>이름</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="뉴스레터 이름을 입력세요"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label required>설명</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="뉴스레터에 대한 설명을 입력하세요"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label required>카테고리</Label>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">카테고리 선택</option>
                {Object.entries(NEWSLETTER_CATEGORY_LABELS).map(
                  ([key, label]) => (
                    <option key={key} value={label}>
                      {label}
                    </option>
                  ),
                )}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label required>썸네일 이미지 URL</Label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                required
              />
            </FormGroup>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>발행 정보</SectionTitle>
            <FormGroup>
              <Label required>발송자 이름</Label>
              <Input
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="발송자 이름"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label required>발송자 이메일</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sender@example.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label required>발행 주기</Label>
              <Input
                name="issueCycle"
                value={formData.issueCycle}
                onChange={handleChange}
                placeholder="예: 매주 월요일, 수 2회"
                required
              />
            </FormGroup>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>연결 및 구독</SectionTitle>
            <FormGroup>
              <Label required>홈페이지 URL</Label>
              <Input
                name="mainPageUrl"
                value={formData.mainPageUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label required>구독 페이지 URL</Label>
              <Input
                name="subscribeUrl"
                value={formData.subscribeUrl}
                onChange={handleChange}
                placeholder="https://example.com/subscribe"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>구독 방식 (선택)</Label>
              <Input
                name="subscribeMethod"
                value={formData.subscribeMethod}
                onChange={handleChange}
                placeholder="예: 이메일 입력, 홈페이지 가입"
              />
            </FormGroup>
            <FormGroup>
              <Label>지난 뉴스레터 아카이브 URL (선택)</Label>
              <Input
                name="previousNewsletterUrl"
                value={formData.previousNewsletterUrl}
                onChange={handleChange}
                placeholder="https://example.com/archive"
              />
            </FormGroup>
          </Section>

          <Footer>
            <Button
              type="button"
              variant="secondary"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => navigate({ to: '/newsletters' } as any)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '등록 중...' : '등록하기'}
            </Button>
          </Footer>
        </Form>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label<{ required?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray700};

  ${({ required, theme }) =>
    required &&
    `
    &::after {
      content: '*';
      color: ${theme.colors.error};
      margin-left: 4px;
    }
  `}
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

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  appearance: none;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.base};
  background-color: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
