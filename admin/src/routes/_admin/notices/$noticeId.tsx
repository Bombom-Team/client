import styled from '@emotion/styled';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { FiCalendar, FiEye, FiUser } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { useNotices } from '@/contexts/NoticeContext';

export const Route = createFileRoute('/_admin/notices/$noticeId')({
  component: NoticeDetailPage,
});

function NoticeDetailPage() {
  const { noticeId } = Route.useParams();
  const navigate = useNavigate();
  const { getNotice, deleteNotice } = useNotices();

  const notice = getNotice(parseInt(noticeId));

  if (!notice) {
    return (
      <Layout title="공지사항 상세">
        <Container>
          <div>공지사항을 찾을 수 없습니다.</div>
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={() => navigate({ to: '/notices' })}
            >
              목록으로 돌아가기
            </Button>
          </ButtonGroup>
        </Container>
      </Layout>
    );
  }

  const handleEdit = () => {
    alert(`공지사항 ID ${noticeId}를 수정합니다. (수정 기능은 아직 미구현)`);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNotice(notice.id);
      navigate({ to: '/notices' });
    }
  };

  return (
    <Layout title="공지사항 상세">
      <Container>
        <Header>
          <Title>{notice.title}</Title>
          <Meta>
            <MetaItem>
              <FiUser />
              <span>{notice.author}</span>
            </MetaItem>
            <MetaItem>
              <FiCalendar />
              <span>{notice.createdAt}</span>
            </MetaItem>
            <MetaItem>
              <FiEye />
              <span>조회 {notice.views}</span>
            </MetaItem>
          </Meta>
        </Header>

        <Content>{notice.content}</Content>

        <ButtonGroup>
          <Button
            variant="secondary"
            onClick={() => navigate({ to: '/notices' })}
          >
            목록
          </Button>
          <Button variant="secondary" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            삭제
          </Button>
        </ButtonGroup>
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

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const Meta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const MetaItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const Content = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;
