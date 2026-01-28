import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { FiBell, FiTrendingUp, FiUserMinus, FiUsers } from 'react-icons/fi';
import { dashboardQueries } from '@/apis/dashboard/dashboard.query';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/')({
  component: IndexPage,
});

function IndexPage() {
  const { data } = useQuery(dashboardQueries.stats());
  const totalMembers = (data?.totalMembers ?? 0).toLocaleString();
  const totalNotices = (data?.totalNotices ?? 0).toLocaleString();
  const monthlyJoinedMembers = (
    data?.monthlyJoinedMembers ?? 0
  ).toLocaleString();
  const dailyJoinedMembers = (data?.dailyJoinedMembers ?? 0).toLocaleString();
  const weeklyJoinedMembers = (data?.weeklyJoinedMembers ?? 0).toLocaleString();
  const yearlyJoinedMembers = (data?.yearlyJoinedMembers ?? 0).toLocaleString();
  const withdrawnMembersThisMonth = (
    data?.withdrawnMembersThisMonth ?? 0
  ).toLocaleString();
  const todayActiveMembers = (data?.todayActiveMembers ?? 0).toLocaleString();

  return (
    <Layout title="대시보드">
      <WelcomeCard>
        <WelcomeTitle>BomBom Admin Dashboard</WelcomeTitle>
        <WelcomeText>관리자 대시보드에 오신 것을 환영합니다</WelcomeText>
      </WelcomeCard>

      <DashboardGrid>
        <CategoryTitle>회원</CategoryTitle>
        <StatCard>
          <IconWrapper color="#4F46E5">
            <FiUsers />
          </IconWrapper>
          <StatInfo>
            <StatLabel>전체 회원</StatLabel>
            <StatValue>{totalMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#0EA5E9">
            <FiUsers />
          </IconWrapper>
          <StatInfo>
            <StatLabel>오늘 활동 회원</StatLabel>
            <StatValue>{todayActiveMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#EF4444">
            <FiUserMinus />
          </IconWrapper>
          <StatInfo>
            <StatLabel>이번 달 탈퇴 회원</StatLabel>
            <StatValue>{withdrawnMembersThisMonth}</StatValue>
          </StatInfo>
        </StatCard>

        <Divider />

        <CategoryTitle>신규 회원</CategoryTitle>
        <StatCard>
          <IconWrapper color="#F59E0B">
            <FiTrendingUp />
            <IconBadge>일</IconBadge>
          </IconWrapper>
          <StatInfo>
            <StatLabel>오늘 신규 회원</StatLabel>
            <StatValue>{dailyJoinedMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#6366F1">
            <FiTrendingUp />
            <IconBadge>주</IconBadge>
          </IconWrapper>
          <StatInfo>
            <StatLabel>이번 주 신규 회원</StatLabel>
            <StatValue>{weeklyJoinedMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#10B981">
            <FiTrendingUp />
            <IconBadge>월</IconBadge>
          </IconWrapper>
          <StatInfo>
            <StatLabel>이번 달 신규 회원</StatLabel>
            <StatValue>{monthlyJoinedMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <StatCard>
          <IconWrapper color="#EC4899">
            <FiTrendingUp />
            <IconBadge>년</IconBadge>
          </IconWrapper>
          <StatInfo>
            <StatLabel>올해 신규 회원</StatLabel>
            <StatValue>{yearlyJoinedMembers}</StatValue>
          </StatInfo>
        </StatCard>

        <Divider />

        <CategoryTitle>공지사항</CategoryTitle>
        <StatCard>
          <IconWrapper color="#8B5CF6">
            <FiBell />
          </IconWrapper>
          <StatInfo>
            <StatLabel>공지사항</StatLabel>
            <StatValue>{totalNotices}</StatValue>
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

const Divider = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.spacing.xs} 0;

  background-color: ${({ theme }) => theme.colors.gray200};

  grid-column: 1 / -1;
`;

const CategoryTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.base};

  grid-column: 1 / -1;
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
  position: relative;
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

const IconBadge = styled.span`
  position: absolute;
  right: 6px;
  bottom: 6px;

  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1;

  opacity: 0.9;
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
