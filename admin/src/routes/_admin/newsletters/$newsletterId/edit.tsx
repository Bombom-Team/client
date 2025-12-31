import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { Layout } from '@/components/Layout';
import NewsletterForm, {
  type NewsletterFormValues,
} from '@/pages/newsletters/NewsletterForm';
import type {
  NewsletterDetail,
  NewsletterPreviousStrategy,
  UpdateNewsletterRequest,
} from '@/types/newsletter';

const NewsletterEditPage = () => {
  const { newsletterId } = Route.useParams();
  const id = Number(newsletterId);
  const { data: newsletter } = useSuspenseQuery(newslettersQueries.detail(id));

  if (!newsletter) return null;

  return <NewsletterEditForm newsletter={newsletter} newsletterId={id} />;
};

export const Route = createFileRoute('/_admin/newsletters/$newsletterId/edit')({
  component: NewsletterEditPage,
});

const NewsletterEditForm = ({
  newsletter,
  newsletterId,
}: {
  newsletter: NewsletterDetail;
  newsletterId: number;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: updateNewsletterMutation, isPending } = useMutation({
    ...newslettersQueries.mutation.update(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newslettersQueries.all });
      queryClient.invalidateQueries({
        queryKey: newslettersQueries.detail(newsletterId).queryKey,
      });
    },
  });

  const initialValues: NewsletterFormValues = {
    name: newsletter.name ?? '',
    description: newsletter.description ?? '',
    imageUrl: newsletter.imageUrl ?? '',
    email: newsletter.email ?? '',
    category: newsletter.categoryName ?? '',
    mainPageUrl: newsletter.mainPageUrl ?? '',
    subscribeUrl: newsletter.subscribeUrl ?? '',
    issueCycle: newsletter.issueCycle ?? '',
    sender: newsletter.sender ?? '',
    previousNewsletterUrl: newsletter.previousNewsletterUrl ?? '',
    subscribeMethod: newsletter.subscribeMethod ?? '',
    previousAllowed:
      newsletter.previousAllowed === undefined
        ? ''
        : newsletter.previousAllowed
          ? 'true'
          : 'false',
    previousStrategy: newsletter.previousStrategy
      ? (newsletter.previousStrategy as NewsletterPreviousStrategy)
      : '',
    previousFixedCount: newsletter.previousFixedCount?.toString() ?? '',
    previousRecentCount: newsletter.previousRecentCount?.toString() ?? '',
    previousExposureRatio: newsletter.previousExposureRatio?.toString() ?? '',
  };

  const parseOptionalNumber = (value: string) => {
    if (!value.trim()) return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const buildPayload = (
    values: NewsletterFormValues,
  ): UpdateNewsletterRequest => ({
    name: values.name.trim(),
    description: values.description.trim(),
    imageUrl: values.imageUrl.trim(),
    email: values.email.trim(),
    category: values.category.trim(),
    mainPageUrl: values.mainPageUrl.trim(),
    subscribeUrl: values.subscribeUrl.trim(),
    issueCycle: values.issueCycle.trim(),
    sender: values.sender.trim(),
    previousNewsletterUrl: values.previousNewsletterUrl.trim() || undefined,
    subscribeMethod: values.subscribeMethod.trim() || undefined,
    previousAllowed:
      values.previousAllowed === ''
        ? undefined
        : values.previousAllowed === 'true',
    previousStrategy: values.previousStrategy || undefined,
    previousFixedCount: parseOptionalNumber(values.previousFixedCount),
    previousRecentCount: parseOptionalNumber(values.previousRecentCount),
    previousExposureRatio: parseOptionalNumber(values.previousExposureRatio),
  });

  const handleSubmit = async (values: NewsletterFormValues) => {
    try {
      await updateNewsletterMutation({
        newsletterId,
        payload: buildPayload(values),
      });
      navigate({
        to: '/newsletters/$newsletterId',
        params: { newsletterId: newsletterId.toString() },
      });
    } catch (error) {
      let message = '뉴스레터 수정에 실패했습니다.';
      if (error instanceof Error && error.message) {
        message += `\n${error.message}`;
      }
      alert(message);
    }
  };

  return (
    <Layout title="뉴스레터 수정">
      <Container>
        <NewsletterForm
          mode="edit"
          initialValues={initialValues}
          submitLabel="수정"
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate({
              to: '/newsletters/$newsletterId',
              params: { newsletterId: newsletterId.toString() },
            })
          }
        />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;
