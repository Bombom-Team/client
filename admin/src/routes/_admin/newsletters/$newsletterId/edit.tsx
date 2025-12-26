import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  newslettersQueries,
  useUpdateNewsletter,
} from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  NEWSLETTER_CATEGORY_LABELS,
  type NewsletterCategoryType,
  PREVIOUS_STRATEGY_LABELS,
} from '@/types/newsletter';
import {
  Container,
  Divider,
  Footer,
  Form,
  FormGroup,
  Input,
  Label,
  Section,
  SectionTitle,
  Select,
  TextArea,
} from './NewsletterFormStyles';
import type { ChangeEvent, FormEvent } from 'react';

export const Route = createFileRoute('/_admin/newsletters/$newsletterId/edit')({
  component: NewsletterEditPage,
});

function NewsletterEditPage() {
  const { newsletterId } = useParams({ from: Route.id });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(Number(newsletterId)),
  );
  const { mutate: updateNewsletter, isPending } = useUpdateNewsletter();

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
    previousStrategy: 'INACTIVE',
    previousFixedCount: 0,
    previousRecentCount: 0,
    previousExposureRatio: 0,
  });

  useEffect(() => {
    if (newsletter) {
      setFormData({
        name: newsletter.name,
        description: newsletter.description,
        imageUrl: newsletter.imageUrl,
        email: newsletter.email,
        category:
          (Object.entries(NEWSLETTER_CATEGORY_LABELS).find(
            ([, label]) => label === newsletter.categoryName,
          )?.[1] as NewsletterCategoryType) || '',
        mainPageUrl: newsletter.mainPageUrl,
        subscribeUrl: newsletter.subscribeUrl,
        issueCycle: newsletter.issueCycle,
        sender: newsletter.sender,
        previousNewsletterUrl: newsletter.previousNewsletterUrl || '',
        subscribeMethod: newsletter.subscribeMethod,
        previousStrategy: newsletter.previousStrategy || 'INACTIVE',
        previousFixedCount: newsletter.previousFixedCount || 0,
        previousRecentCount: newsletter.previousRecentCount || 0,
        previousExposureRatio: newsletter.previousExposureRatio || 0,
      });
    }
  }, [newsletter]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    updateNewsletter(
      {
        id: Number(newsletterId),
        ...formData,
        category: formData.category as string,
      },
      {
        onSuccess: () => {
          alert('뉴스레터가 성공적으로 수정되었습니다.');
          void queryClient.invalidateQueries({
            queryKey: ['newsletters', 'detail', Number(newsletterId)],
          });
          void queryClient.invalidateQueries({ queryKey: ['newsletters'] });
          void navigate({
            to: '/newsletters/$newsletterId',
            params: { newsletterId },
          });
        },
        onError: (error) => {
          alert(`수정 실패: ${error.message}`);
        },
      },
    );
  };

  return (
    <Layout title="뉴스레터 수정">
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

          <Divider />

          <Section>
            <SectionTitle>지난 뉴스레터 정책</SectionTitle>
            <FormGroup>
              <Label required>공개 전략</Label>
              <Select
                name="previousStrategy"
                value={formData.previousStrategy}
                onChange={handleChange}
                required
              >
                {Object.entries(PREVIOUS_STRATEGY_LABELS).map(
                  ([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ),
                )}
              </Select>
            </FormGroup>

            {formData.previousStrategy !== 'INACTIVE' && (
              <>
                <FormGroup>
                  <Label required>고정 수집 개수</Label>
                  <Input
                    name="previousFixedCount"
                    type="number"
                    value={formData.previousFixedCount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label required>최신 수집 개수</Label>
                  <Input
                    name="previousRecentCount"
                    type="number"
                    value={formData.previousRecentCount}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label required>노출 비율 (%)</Label>
                  <Input
                    name="previousExposureRatio"
                    type="number"
                    value={formData.previousExposureRatio}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </FormGroup>
              </>
            )}
          </Section>

          <Footer>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                void navigate({
                  to: '/newsletters/$newsletterId',
                  params: { newsletterId },
                });
              }}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? '수정 중...' : '수정하기'}
            </Button>
          </Footer>
        </Form>
      </Container>
    </Layout>
  );
}
