import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { newsletterRequestsQueries } from '@/apis/newsletterRequests/newsletterRequests.query';
import { Layout } from '@/components/Layout';
import {
  DRAFT_COLLECT_STATUS_LABELS,
  NEWSLETTER_REQUEST_STATUS_LABELS,
  type NewsletterRequestStatus,
} from '@/types/newsletterRequest';

const STATUS_TABS: {
  value: NewsletterRequestStatus | undefined;
  label: string;
}[] = [
  { value: 'REVIEWING', label: '검토 대기' },
  { value: 'RECEIVED', label: '수집 중' },
  { value: 'APPROVED', label: '등록됨' },
  { value: 'REJECTED', label: '반려됨' },
  { value: undefined, label: '전체' },
];

const isStatus = (value: unknown): value is NewsletterRequestStatus =>
  value === 'RECEIVED' ||
  value === 'REVIEWING' ||
  value === 'APPROVED' ||
  value === 'REJECTED';

export const Route = createFileRoute('/_admin/newsletter-requests/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { status?: NewsletterRequestStatus } => ({
    status: isStatus(search.status) ? search.status : undefined,
  }),
  component: NewsletterRequestListPage,
});

function NewsletterRequestListPage() {
  const navigate = useNavigate();
  const { status } = Route.useSearch();
  const { data: requests = [], isLoading } = useQuery(
    newsletterRequestsQueries.list({ status }),
  );

  return (
    <Layout title="뉴스레터 신청">
      <Container>
        <TabWrapper>
          {STATUS_TABS.map((tab) => (
            <TabButton
              key={tab.label}
              type="button"
              isActive={tab.value === status}
              onClick={() =>
                navigate({
                  to: '/newsletter-requests',
                  search: tab.value ? { status: tab.value } : {},
                })
              }
            >
              {tab.label}
            </TabButton>
          ))}
        </TabWrapper>

        <Table>
          <thead>
            <tr>
              <th>신청 이름 / 자동 수집 이름</th>
              <th>링크</th>
              <th>공감</th>
              <th>수집</th>
              <th>상태</th>
              <th>신청일</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <Link
                    to="/newsletter-requests/$requestId"
                    params={{ requestId: String(request.id) }}
                  >
                    <NameText>{request.requestedName}</NameText>
                    {request.draftName &&
                      request.draftName !== request.requestedName && (
                        <SubText>{request.draftName}</SubText>
                      )}
                  </Link>
                </td>
                <td>
                  <UrlText>{request.requestedUrl}</UrlText>
                </td>
                <td>{request.supporterCount}</td>
                <td>
                  {request.collectStatus
                    ? DRAFT_COLLECT_STATUS_LABELS[request.collectStatus]
                    : '-'}
                </td>
                <td>{NEWSLETTER_REQUEST_STATUS_LABELS[request.status]}</td>
                <td>{request.createdAt.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!isLoading && requests.length === 0 && (
          <EmptyText>해당하는 신청이 없습니다.</EmptyText>
        )}
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const TabWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: 1px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.primary : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.white : theme.colors.gray700};

  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  background-color: ${({ theme }) => theme.colors.white};

  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

    text-align: left;
    vertical-align: top;
  }

  th {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: 13px;
  }
`;

const NameText = styled.div`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: 600;
`;

const SubText = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 13px;
`;

const UrlText = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 13px;
  word-break: break-all;
`;

const EmptyText = styled.p`
  padding: 40px 0;

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;
