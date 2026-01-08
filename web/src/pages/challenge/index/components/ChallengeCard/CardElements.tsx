import styled from '@emotion/styled';

export const Tag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;

  align-self: flex-start;

  background-color: ${({ theme }) => `${theme.colors.primaryLight}40`};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;

export const CardDetailButton = styled.button`
  border: none;

  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};

  &:hover {
    text-decoration: underline;
  }
`;
