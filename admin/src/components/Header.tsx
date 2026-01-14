import styled from '@emotion/styled';
import { FiUser } from 'react-icons/fi';
import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  rightAction?: ReactNode;
}

export const Header = ({ title, rightAction }: HeaderProps) => {
  return (
    <HeaderContainer>
      <PageTitle>{title}</PageTitle>
      <RightSection>
        {rightAction && <ActionWrapper>{rightAction}</ActionWrapper>}
        <UserInfo>
          <UserName>관리자</UserName>
          <UserAvatar>
            <FiUser />
          </UserAvatar>
        </UserInfo>
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  height: 64px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
