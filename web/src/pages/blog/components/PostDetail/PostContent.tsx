import styled from '@emotion/styled';
import { renderTiptapJson } from '../../utils/renderTiptapJson';
import { parseTiptapDoc } from '../../utils/tiptap';
interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const renderedContent = renderTiptapJson(parseTiptapDoc(content));

  return (
    <Container>
      <Content>{renderedContent}</Content>
    </Container>
  );
};

export default PostContent;

const Container = styled.section`
  width: 100%;
  margin: 0 auto;

  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Content = styled.div`
  font: ${({ theme }) => theme.fonts.bodyLarge};
  line-height: 1.7;

  h1,
  h2,
  h3 {
    font-weight: 700;
  }

  h1 {
    margin: 20px 0 8px;
    font-size: 1.75rem;
  }

  h2 {
    margin: 18px 0 8px;
    font-size: 1.5rem;
  }

  h3 {
    margin: 16px 0 8px;
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 12px;

    line-height: 1.7;
    white-space: normal;
  }

  ul,
  ol {
    margin-bottom: 12px;
    padding-left: 24px;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.7;
  }

  blockquote {
    padding-left: 16px;
    border-left: 3px solid ${({ theme }) => theme.colors.dividers};

    color: ${({ theme }) => theme.colors.textSecondary};
  }

  code {
    padding: 1px 5px;
    border-radius: 4px;

    background: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-family: 'Courier New', Consolas, monospace;
    font-size: 0.875em;
  }

  pre {
    margin-bottom: 12px;
    padding: 16px;
    border-radius: 8px;

    background: #1e1e2e;

    overflow-x: auto;

    code {
      padding: 0;
      border-radius: 0;

      background: none;
      color: #cdd6f4;
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }

  img {
    max-width: 100%;
    margin: 8px 0;
    border-radius: 8px;

    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  hr {
    margin: 24px 0;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.dividers};
  }

  s {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  p[data-caption] {
    margin-bottom: 8px;

    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;
