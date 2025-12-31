import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createNewsletter } from '@/apis/newsletters/newsletters.api';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { Layout } from '@/components/Layout';
import NewsletterForm, {
  type NewsletterFormValues,
} from '@/pages/newsletters/NewsletterForm';
import type { CreateNewsletterRequest } from '@/types/newsletter';

const NewsletterCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const listSearch = {
    keyword: '',
    category: '',
    previousStrategy: '',
    sort: 'LATEST',
  };
  const { mutateAsync: createNewsletterMutation, isPending } = useMutation({
    mutationFn: createNewsletter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newslettersQueries.all });
    },
  });

  const initialValues: NewsletterFormValues = {
    name: '',
    description: '',
    imageUrl: '',
    email: '',
    category: '',
    mainPageUrl: '',
    subscribeUrl: '',
    issueCycle: '',
    sender: '',
    previousNewsletterUrl: '',
    subscribeMethod: '',
    previousAllowed: '',
    previousStrategy: '',
    previousFixedCount: '',
    previousRecentCount: '',
    previousExposureRatio: '',
  };

  const buildPayload = (
    values: NewsletterFormValues,
  ): CreateNewsletterRequest => ({
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
  });

  const handleSubmit = async (values: NewsletterFormValues) => {
    try {
      await createNewsletterMutation(buildPayload(values));
      navigate({ to: '/newsletters', search: listSearch });
    } catch (error) {
      let message = '뉴스레터 등록에 실패했습니다.';
      if (error instanceof Error && error.message) {
        message += `\n${error.message}`;
      }
      alert(message);
    }
  };

  return (
    <Layout title="뉴스레터 등록">
      <Container>
        <NewsletterForm
          mode="create"
          initialValues={initialValues}
          submitLabel="등록"
          isSubmitting={isPending}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: '/newsletters', search: listSearch })}
        />
      </Container>
    </Layout>
  );
};

export const Route = createFileRoute('/_admin/newsletters/new')({
  component: NewsletterCreatePage,
});

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;
