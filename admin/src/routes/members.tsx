import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { FiSearch, FiShield } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import type { Member } from '@/types/member';

export const Route = createFileRoute('/members')({
  component: MembersPage,
});

// Mock data
const mockMembers: Member[] = [
  {
    id: 1,
    email: 'admin@bombom.news',
    name: '관리자',
    role: 'admin',
    createdAt: '2024-01-15',
    lastLogin: '2024-12-19',
  },
  {
    id: 2,
    email: 'user1@example.com',
    name: '김철수',
    role: 'user',
    createdAt: '2024-02-20',
    lastLogin: '2024-12-18',
  },
  {
    id: 3,
    email: 'user2@example.com',
    name: '이영희',
    role: 'user',
    createdAt: '2024-03-10',
    lastLogin: '2024-12-17',
  },
  {
    id: 4,
    email: 'user3@example.com',
    name: '박민수',
    role: 'user',
    createdAt: '2024-04-05',
    lastLogin: '2024-12-19',
  },
];

function MembersPage() {
  const [members] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleMakeAdmin = (memberId: number) => {
    alert(`회원 ID ${memberId}를 관리자로 지정합니다.`);
  };

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
              <Th>최근 로그인</Th>
              <Th>액션</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredMembers.map((member) => (
              <Tr key={member.id}>
                <Td>{member.id}</Td>
                <Td>{member.name}</Td>
                <Td>{member.email}</Td>
                <Td>
                  <Badge variant={member.role}>
                    {member.role === 'admin' && <FiShield />}
                    {member.role === 'admin' ? '관리자' : '일반 회원'}
                  </Badge>
                </Td>
                <Td>{member.createdAt}</Td>
                <Td>{member.lastLogin}</Td>
                <Td>
                  <ActionButtons>
                    {member.role === 'user' && (
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

const Badge = styled.span<{ variant: 'admin' | 'user' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;

  background-color: ${({ variant, theme }) =>
    variant === 'admin' ? theme.colors.primary : theme.colors.gray200};
  color: ${({ variant, theme }) =>
    variant === 'admin' ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
