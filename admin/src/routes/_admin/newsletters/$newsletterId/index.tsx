import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  useUpdateNewsletterStatusMutation,
  newslettersQueries,
} from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  NEWSLETTER_DETAIL_STATUS_LABELS,
  NEWSLETTER_STATUS_LABELS,
  PREVIOUS_STRATEGY_LABELS,
  type NewsletterDetailStatusType,
  type NewsletterStatusType,
  type PreviousStrategyType,
} from '@/types/newsletter';

export const Route = createFileRoute('/_admin/newsletters/$newsletterId/')({
  component: NewsletterDetailView,
});

const mapDetailStatusToRequestStatus = (
  status: NewsletterDetailStatusType,
): NewsletterStatusType => {
  if (status === 'ACTIVE' || status === 'DISCONTINUED') {
    return status;
  }
  return 'SUSPENDED';
};

function NewsletterDetailView() {
  const { newsletterId } = useParams({ from: Route.id });
  const queryClient = useQueryClient();

  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(Number(newsletterId)),
  );
  const { mutate: updateStatus, isPending: isStatusUpdating } =
    useUpdateNewsletterStatusMutation();
  const [statusForm, setStatusForm] = useState<{
    status: NewsletterStatusType;
    suspendedAt: string;
  }>({
    status: 'ACTIVE',
    suspendedAt: '',
  });

  useEffect(() => {
    if (!newsletter) return;
    setStatusForm({
      status: mapDetailStatusToRequestStatus(newsletter.status),
      suspendedAt: newsletter.suspendedAt ?? '',
    });
  }, [newsletter]);

  if (!newsletter) return null;

  const handleStatusSubmit = () => {
    if (statusForm.status === 'SUSPENDED' && !statusForm.suspendedAt) {
      alert('휴재일을 입력해주세요.');
      return;
    }

    updateStatus(
      {
        id: Number(newsletterId),
        status: statusForm.status,
        suspendedAt:
          statusForm.status === 'SUSPENDED'
            ? statusForm.suspendedAt
            : undefined,
      },
      {
        onSuccess: () => {
          alert('상태가 변경되었습니다.');
          void queryClient.invalidateQueries({
            queryKey: ['newsletters', 'detail', Number(newsletterId)],
          });
          void queryClient.invalidateQueries({ queryKey: ['newsletters'] });
        },
        onError: (error) => {
          alert(`상태 변경 실패: ${error.message}`);
        },
      },
    );
  };

  return (
    <Layout title="뉴스레터 상세">
      <Container>
        <HeaderSection>
          <Thumbnail src={newsletter.imageUrl} alt={newsletter.name} />
          <HeaderInfo>
            <Category>{newsletter.categoryName}</Category>
            <Title>{newsletter.name}</Title>
            <Description>{newsletter.description}</Description>
          </HeaderInfo>
        </HeaderSection>

        <Divider />

        <SectionTitle>상세 정보</SectionTitle>
        <GridContainer>
          <GridItem>
            <Label>발행 주기</Label>
            <Value>{newsletter.issueCycle}</Value>
          </GridItem>
          <GridItem>
            <Label>구독자 수</Label>
            <Value>{newsletter.subscriptionCount?.toLocaleString()}</Value>
          </GridItem>
          <GridItem>
            <Label>구독 방식</Label>
            <Value>{newsletter.subscribeMethod}</Value>
          </GridItem>
          <GridItem>
            <Label>발송자 이름</Label>
            <Value>{newsletter.sender}</Value>
          </GridItem>
          <GridItem>
            <Label>발송자 이메일</Label>
            <Value>{newsletter.email}</Value>
          </GridItem>
        </GridContainer>

        <Divider />

        <SectionTitle>연결 링크</SectionTitle>
        <LinkGrid>
          <LinkItem>
            <LinkLabel>홈페이지</LinkLabel>
            <LinkValue
              href={newsletter.mainPageUrl}
              target="_blank"
              rel="noreferrer"
            >
              바로가기 ↗
            </LinkValue>
          </LinkItem>
          <LinkItem>
            <LinkLabel>구독 페이지</LinkLabel>
            <LinkValue
              href={newsletter.subscribeUrl}
              target="_blank"
              rel="noreferrer"
            >
              바로가기 ↗
            </LinkValue>
          </LinkItem>
          {newsletter.previousNewsletterUrl && (
            <LinkItem>
              <LinkLabel>지난 아티클 아카이브</LinkLabel>
              <LinkValue
                href={newsletter.previousNewsletterUrl}
                target="_blank"
                rel="noreferrer"
              >
                바로가기 ↗
              </LinkValue>
            </LinkItem>
          )}
        </LinkGrid>

        <Divider />

        <SectionTitle>발행 상태</SectionTitle>
        <StatusSection>
          <StatusRow>
            <StatusLabel>현재 상태</StatusLabel>
            <StatusValue>
              {NEWSLETTER_DETAIL_STATUS_LABELS[newsletter.status]}
            </StatusValue>
          </StatusRow>
          <StatusRow>
            <StatusLabel>변경할 상태</StatusLabel>
            <StatusSelect
              value={statusForm.status}
              onChange={(e) => {
                const status = e.target.value as NewsletterStatusType;
                setStatusForm((prev) => ({
                  ...prev,
                  status,
                }));
              }}
            >
              {Object.entries(NEWSLETTER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </StatusSelect>
          </StatusRow>
          {statusForm.status === 'SUSPENDED' && (
            <StatusRow>
              <StatusLabel>휴재일</StatusLabel>
              <StatusDateInput
                type="date"
                value={statusForm.suspendedAt}
                onChange={(e) => {
                  setStatusForm((prev) => ({
                    ...prev,
                    suspendedAt: e.target.value,
                  }));
                }}
              />
            </StatusRow>
          )}
          <StatusAction>
            <Button onClick={handleStatusSubmit} disabled={isStatusUpdating}>
              {isStatusUpdating ? '변경 중...' : '상태 변경'}
            </Button>
          </StatusAction>
        </StatusSection>

        <Divider />

        <SectionTitle>지난 뉴스레터 정책</SectionTitle>
        <GridContainer>
          <GridItem>
            <Label>공개 전략</Label>
            <Value>
              {
                PREVIOUS_STRATEGY_LABELS[
                  newsletter.previousStrategy as PreviousStrategyType
                ]
              }
            </Value>
          </GridItem>

          {newsletter.previousStrategy !== 'INACTIVE' && (
            <>
              <GridItem>
                <Label>고정 수집 개수</Label>
                <Value>{newsletter.previousFixedCount}개</Value>
              </GridItem>
              <GridItem>
                <Label>최신 수집 개수</Label>
                <Value>{newsletter.previousRecentCount}개</Value>
              </GridItem>
              <GridItem>
                <Label>노출 비율</Label>
                <Value>{newsletter.previousExposureRatio}%</Value>
              </GridItem>
            </>
          )}
        </GridContainer>

        <Footer>
          <Link
            to="/newsletters/$newsletterId/edit"
            params={{ newsletterId }}
            style={{ textDecoration: 'none' }}
          >
            <Button as="span">수정 하기</Button>
          </Link>
        </Footer>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-direction: column;

  background: white;
`;

const HeaderSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex-shrink: 0;

  background-color: #f3f4f6;

  object-fit: cover;
`;

const HeaderInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  flex-direction: column;
`;

const Category = styled.span`
  padding: 2px 6px;
  border-radius: 4px;

  display: inline-block;
  align-self: flex-start;

  background-color: #ffedd5;
  color: #ea580c;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 11px;
`;

const Title = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
`;

const SectionTitle = styled.h2`
  margin: 0 0 2px;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const GridContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};

  grid-template-columns: 1fr 1fr;
`;

const GridItem = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const Value = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const LinkGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};

  grid-template-columns: 1fr 1fr;
`;

const LinkItem = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const LinkLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const LinkValue = styled.a`
  display: inline-flex;
  gap: 4px;
  align-items: center;

  color: #ea580c;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const StatusSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const StatusRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const StatusLabel = styled.span`
  min-width: 96px;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const StatusValue = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const StatusSelect = styled.select`
  min-width: 160px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusDateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusAction = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
