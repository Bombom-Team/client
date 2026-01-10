import styled from '@emotion/styled';

const CardDetailButton = styled.button`
  border: none;

  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};

  &:hover {
    text-decoration: underline;
  }
`;

export default CardDetailButton;
