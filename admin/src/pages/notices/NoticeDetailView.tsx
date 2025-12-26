import styled from '@emotion/styled';
import { NOTICE_CATEGORY_LABELS, type Notice } from '@/types/notice';

interface NoticeDetailViewProps {
  notice: Notice;
  children?: React.ReactNode;
}

export function NoticeDetailView({ notice, children }: NoticeDetailViewProps) {
  return (
    <Container>
      <HeaderContainer>
        <CategoryBadge category={notice.noticeCategory}>
          {NOTICE_CATEGORY_LABELS[notice.noticeCategory] ??
            notice.noticeCategory}
        </CategoryBadge>
        <Title>{notice.title}</Title>
        <DateText>{notice.createdAt}</DateText>
      </HeaderContainer>

      <Content>{notice.content}</Content>

      {children}
    </Container>
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

const Content = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Title = styled.h1`
  flex: 1;
  margin: 0;
  line-height: 1.3;
  word-break: break-all;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const CategoryBadge = styled.span<{ category: string }>`
  flex-shrink: 0;
  margin-top: 6px;

  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const DateText = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  margin-top: 10px;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
