import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FiSearch, FiShield } from 'react-icons/fi';
import { getMembers } from '@/apis/members';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/members')({
  component: MembersPage,
});

function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });

  const members = data?.content || [];
  console.log(data);

  const filteredMembers = members.filter(
    (member) =>
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleMakeAdmin = (memberId: number) => {
    alert(`회원 ID ${memberId}를 관리자로 지정합니다.`);
  };

  if (isLoading) {
    return (
      <Layout title="멤버 관리">
        <Container>
          <LoadingMessage>멤버 목록을 불러오는 중...</LoadingMessage>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="멤버 관리">
        <Container>
          <ErrorMessage>
            멤버 목록을 불러오는데 실패했습니다.
            {error instanceof Error && `: ${error.message}`}
          </ErrorMessage>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="멤버 관리">
      <Container>
        <Header>
          <Title>전체 회원 ({members.length}명)</Title>
        </Header>

        <SearchBar>
          <FiSearch size={20} />
          <SearchInput
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>

        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>역할</Th>
              <Th>가입일</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredMembers.map((member) => (
              <Tr key={member.id}>
                <Td>{member.id}</Td>
                <Td>{member.nickname}</Td>
                <Td>{member.email}</Td>
                <Td>
                  <Badge variant={member.role}>
                    {member.role === 'ADMIN' && <FiShield />}
                    {member.role === 'ADMIN' ? '관리자' : '일반 회원'}
                  </Badge>
                </Td>
                <Td>
                  <ActionButtons>
                    {member.role === 'USER' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleMakeAdmin(member.id)}
                      >
                        관리자 지정
                      </Button>
                    )}
                  </ActionButtons>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const SearchBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const SearchInput = styled.input`
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex: 1;

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Badge = styled.span<{ variant: 'ADMIN' | 'USER' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;

  background-color: ${({ variant, theme }) =>
    variant === 'ADMIN' ? theme.colors.primary : theme.colors.gray200};
  color: ${({ variant, theme }) =>
    variant === 'ADMIN' ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LoadingMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.base};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.base};
  text-align: center;
`;
