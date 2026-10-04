import styled from '@emotion/styled';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type ChangeEvent } from 'react';
import { categoriesQueries } from '@/apis/categories/categories.query';
import {
  newsletterRequestsQueries,
  useApproveNewsletterRequestMutation,
  useRecollectNewsletterRequestMutation,
  useRejectNewsletterRequestMutation,
  useUpdateNewsletterRequestDraftMutation,
} from '@/apis/newsletterRequests/newsletterRequests.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  Container,
  Divider,
  FormGroup,
  Input,
  Label,
  Section,
  SectionTitle,
  Select,
  TextArea,
} from '@/routes/_admin/newsletters/NewsletterFormStyles';
import {
  DRAFT_COLLECT_STATUS_LABELS,
  DRAFT_FIELD_LABELS,
  NEWSLETTER_REQUEST_STATUS_LABELS,
  type NewsletterRequestDraft,
  type UpdateNewsletterRequestDraftRequest,
} from '@/types/newsletterRequest';

export const Route = createFileRoute('/_admin/newsletter-requests/$requestId')({
  component: NewsletterRequestReviewPage,
});

type DraftForm = {
  name: string;
  description: string;
  imageUrl: string;
  email: string;
  categoryId: string;
  mainPageUrl: string;
  subscribeUrl: string;
  issueCycle: string;
  sender: string;
  subscribeMethod: string;
  previousNewsletterUrl: string;
};

type TextFieldName = Exclude<keyof DraftForm, 'categoryId'>;

const TEXT_FIELDS: { name: TextFieldName; label: string; required: boolean }[] =
  [
    { name: 'name', label: '이름', required: true },
    { name: 'email', label: '발송자 이메일', required: true },
    { name: 'sender', label: '발송자 이름', required: true },
    { name: 'issueCycle', label: '발행 주기', required: true },
    { name: 'mainPageUrl', label: '홈페이지 URL', required: true },
    { name: 'subscribeUrl', label: '구독 페이지 URL', required: true },
    { name: 'imageUrl', label: '썸네일 이미지 URL', required: true },
    { name: 'subscribeMethod', label: '구독 방식', required: false },
    {
      name: 'previousNewsletterUrl',
      label: '지난 뉴스레터 아카이브 URL',
      required: false,
    },
  ];

const toForm = (draft: NewsletterRequestDraft): DraftForm => ({
  name: draft.name ?? '',
  description: draft.description ?? '',
  imageUrl: draft.imageUrl ?? '',
  email: draft.email ?? '',
  categoryId: draft.categoryId ? String(draft.categoryId) : '',
  mainPageUrl: draft.mainPageUrl ?? '',
  subscribeUrl: draft.subscribeUrl ?? '',
  issueCycle: draft.issueCycle ?? '',
  sender: draft.sender ?? '',
  subscribeMethod: draft.subscribeMethod ?? '',
  previousNewsletterUrl: draft.previousNewsletterUrl ?? '',
});

// 빈 값은 보내지 않는다. 서버는 보낸 필드만 수정한다.
const toUpdateRequest = (
  form: DraftForm,
): UpdateNewsletterRequestDraftRequest =>
  Object.fromEntries(
    Object.entries(form)
      .filter(([, value]) => value.trim() !== '')
      .map(([key, value]) => [
        key,
        key === 'categoryId' ? Number(value) : value.trim(),
      ]),
  );

function NewsletterRequestReviewPage() {
  const { requestId } = Route.useParams();
  const id = Number(requestId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: request } = useQuery(newsletterRequestsQueries.detail(id));
  const { data: categories = [] } = useQuery(categoriesQueries.list());
  const [form, setForm] = useState<DraftForm | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { mutateAsync: updateDraft, isPending: isSaving } =
    useUpdateNewsletterRequestDraftMutation();
  const { mutate: recollect, isPending: isRecollecting } =
    useRecollectNewsletterRequestMutation();
  const { mutate: approve, isPending: isApproving } =
    useApproveNewsletterRequestMutation();
  const { mutate: reject, isPending: isRejecting } =
    useRejectNewsletterRequestMutation();

  useEffect(() => {
    if (request) setForm(toForm(request.draft));
  }, [request]);

  if (!request || !form) {
    return <Layout title="뉴스레터 신청 검토">불러오는 중...</Layout>;
  }

  const isClosed =
    request.status === 'APPROVED' || request.status === 'REJECTED';
  const isCollected = request.draft.collectStatus === 'SUCCESS';
  const missingFields = Object.entries(DRAFT_FIELD_LABELS)
    .filter(([key]) => (form[key as keyof DraftForm] ?? '').trim() === '')
    .map(([, label]) => label);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: newsletterRequestsQueries.all });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const saveDraft = async () => {
    await updateDraft({ id, body: toUpdateRequest(form) });
    await refresh();
  };

  const handleSave = async () => {
    try {
      await saveDraft();
      alert('초안을 저장했습니다.');
    } catch (error) {
      alert(`저장 실패: ${(error as Error).message}`);
    }
  };

  const handleRecollect = () => {
    if (!confirm('자동 수집을 다시 실행할까요? 1분 안에 다시 수집됩니다.'))
      return;
    recollect(id, {
      onSuccess: () => {
        alert('재수집을 예약했습니다.');
        void refresh();
      },
      onError: (error) => alert(`재수집 실패: ${error.message}`),
    });
  };

  const handleApprove = async () => {
    if (missingFields.length > 0) {
      alert(`비어 있는 필수 값: ${missingFields.join(', ')}`);
      return;
    }
    if (!confirm('이 초안으로 뉴스레터를 등록할까요?')) return;
    try {
      await saveDraft();
    } catch (error) {
      alert(`저장 실패: ${(error as Error).message}`);
      return;
    }
    approve(id, {
      onSuccess: ({ newsletterId }) => {
        alert('뉴스레터를 등록했습니다.');
        void refresh();
        void queryClient.invalidateQueries({ queryKey: ['newsletters'] });
        void navigate({
          to: '/newsletters/$newsletterId',
          params: { newsletterId: String(newsletterId) },
        });
      },
      onError: (error) => alert(`승인 실패: ${error.message}`),
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    if (!confirm('이 신청을 반려할까요?')) return;
    reject(
      { id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          alert('반려했습니다.');
          void refresh();
          void navigate({ to: '/newsletter-requests' });
        },
        onError: (error) => alert(`반려 실패: ${error.message}`),
      },
    );
  };

  return (
    <Layout title="뉴스레터 신청 검토">
      <Container>
        <Section>
          <SectionTitle>신청 정보</SectionTitle>
          <InfoGrid>
            <dt>신청 이름</dt>
            <dd>{request.requestedName}</dd>
            <dt>신청 링크</dt>
            <dd>
              <a href={request.requestedUrl} target="_blank" rel="noreferrer">
                {request.requestedUrl}
              </a>
            </dd>
            <dt>상태</dt>
            <dd>{NEWSLETTER_REQUEST_STATUS_LABELS[request.status]}</dd>
            <dt>공감</dt>
            <dd>{request.likeCount}명</dd>
            <dt>자동 수집</dt>
            <dd>
              {DRAFT_COLLECT_STATUS_LABELS[request.draft.collectStatus]} (시도{' '}
              {request.draft.collectAttemptCount}회)
              {request.draft.failureReason && (
                <FailureText>{request.draft.failureReason}</FailureText>
              )}
            </dd>
            {request.rejectReason && (
              <>
                <dt>반려 사유</dt>
                <dd>{request.rejectReason}</dd>
              </>
            )}
          </InfoGrid>
          {request.reason && <ReasonBox>“{request.reason}”</ReasonBox>}
        </Section>

        <Divider />

        <Section>
          <SectionTitle>
            등록 초안
            {isCollected && <AutoBadge>자동 수집됨</AutoBadge>}
          </SectionTitle>
          {missingFields.length > 0 && (
            <MissingBox>
              비어 있는 필수 값: {missingFields.join(', ')}
            </MissingBox>
          )}
          <FormGroup>
            <Label required>설명</Label>
            <TextArea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isClosed}
            />
          </FormGroup>
          <FormGroup>
            <Label required>카테고리</Label>
            <Select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={isClosed}
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          {TEXT_FIELDS.map((field) => (
            <FormGroup key={field.name}>
              <Label required={field.required}>{field.label}</Label>
              <Input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={isClosed}
                placeholder={
                  field.name === 'email'
                    ? '자동 수집하지 않습니다. 발신 주소를 직접 입력해주세요.'
                    : undefined
                }
              />
            </FormGroup>
          ))}
          {form.imageUrl && (
            <ThumbnailPreview src={form.imageUrl} alt="썸네일 미리보기" />
          )}
        </Section>

        {!isClosed && (
          <>
            <Divider />
            <Section>
              <SectionTitle>반려</SectionTitle>
              <TextArea
                value={rejectReason}
                placeholder="반려 사유 (신청자에게 보이지 않습니다)"
                onChange={(event) => setRejectReason(event.target.value)}
              />
            </Section>
            <ActionWrapper>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isRejecting}
              >
                반려
              </Button>
              <Button
                variant="secondary"
                onClick={handleRecollect}
                disabled={isRecollecting}
              >
                재수집
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={isSaving}
              >
                초안 저장
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving || isSaving}
              >
                승인하고 등록
              </Button>
            </ActionWrapper>
          </>
        )}
      </Container>
    </Layout>
  );
}

const InfoGrid = styled.dl`
  display: grid;
  gap: 8px 16px;
  grid-template-columns: 120px 1fr;

  dt {
    color: ${({ theme }) => theme.colors.gray500};
  }

  dd {
    margin: 0;
    word-break: break-all;
  }
`;

const FailureText = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 13px;
`;

const ReasonBox = styled.p`
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray700};
`;

const AutoBadge = styled.span`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
`;

const MissingBox = styled.div`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.warning};
`;

const ThumbnailPreview = styled.img`
  width: 96px;
  height: 96px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  object-fit: cover;
`;

const ActionWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;
