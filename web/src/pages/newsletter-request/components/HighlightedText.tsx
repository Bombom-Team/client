import styled from '@emotion/styled';
import { splitByKeyword } from '../utils/highlightKeyword';

interface HighlightedTextProps {
  text: string;
  keyword: string;
}

const HighlightedText = ({ text, keyword }: HighlightedTextProps) => {
  return (
    <>
      {splitByKeyword(text, keyword).map((part, index) =>
        part.isMatch ? (
          <Match key={index}>{part.text}</Match>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
};

export default HighlightedText;

const Match = styled.mark`
  background: none;
  color: ${({ theme }) => theme.colors.primaryDark};
`;
