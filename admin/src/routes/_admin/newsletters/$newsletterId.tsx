import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import {
  newslettersQueries,
  useDeleteNewsletter,
} from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/newsletters/$newsletterId')({
  component: NewsletterDetailView,
});

function NewsletterDetailView() {
  const { newsletterId } = useParams({ from: Route.id });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(Number(newsletterId)),
  );
  const { mutate: deleteNewsletter } = useDeleteNewsletter();

  const handleDelete = () => {
    if (confirm('정말로 삭제하시겠습니까?')) {
      deleteNewsletter(Number(newsletterId), {
        onSuccess: () => {
          alert('삭제되었습니다.');
          queryClient.invalidateQueries({ queryKey: ['newsletters'] });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          navigate({ to: '/newsletters' } as any);
        },
        onError: (error) => {
          alert(`삭제 실패: ${error.message}`);
        },
      });
    }
  };

  if (!newsletter) return null;

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

        <SectionTitle>지난 뉴스레터 정책</SectionTitle>
        <GridContainer>
          <GridItem>
            <Label>공개 전략</Label>
            <Value>{newsletter.previousStrategy}</Value>
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
          <Button>수정 하기</Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            삭제
          </Button>
        </Footer>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 800px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
  background-color: #f3f4f6;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const Category = styled.span`
  background-color: #ffedd5; // Light orange/peach
  color: #ea580c; // Dark orange
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  align-self: flex-start;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray600};
  line-height: 1.5;
  margin: 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
  margin: 0;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray900};
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: ${({ theme }) => theme.spacing.xxl};
  row-gap: ${({ theme }) => theme.spacing.lg};
`;

const LinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LinkLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
`;

const LinkValue = styled.a`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: #ea580c; // Orange link color
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
