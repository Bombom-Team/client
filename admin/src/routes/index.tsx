import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { FiBell, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <Layout title="대시보드">
      <WelcomeCard>
        <WelcomeTitle>BomBom Admin Dashboard</WelcomeTitle>
        <WelcomeText>관리자 대시보드에 오신 것을 환영합니다</WelcomeText>
      </WelcomeCard>

      <DashboardGrid>
        <StatCard>
          <IconWrapper color="#4F46E5">
            <FiUsers />
          </IconWrapper>
          <StatInfo>
            <StatLabel>전체 회원</StatLabel>
            <StatValue>1,234</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#8B5CF6">
            <FiBell />
          </IconWrapper>
          <StatInfo>
            <StatLabel>공지사항</StatLabel>
            <StatValue>42</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#10B981">
            <FiTrendingUp />
          </IconWrapper>
          <StatInfo>
            <StatLabel>이번 달 신규 회원</StatLabel>
            <StatValue>89</StatValue>
          </StatInfo>
        </StatCard>
      </DashboardGrid>
    </Layout>
  );
}

const DashboardGrid = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const WelcomeCard = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  color: ${({ theme }) => theme.colors.white};
`;

const WelcomeTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['3xl']};
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  opacity: 0.9;
`;
