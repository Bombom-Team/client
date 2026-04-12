import styled from '@emotion/styled';
import { renderTiptapJson } from '../../utils/renderTiptapJson';
import { parseTiptapDoc } from '../../utils/tiptap';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const device = useDevice();
  const renderedContent = renderTiptapJson(parseTiptapDoc(content));

  return (
    <Container device={device}>
      <Content device={device}>{renderedContent}</Content>
    </Container>
  );
};

export default PostContent;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  margin: 0 auto;

  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Content = styled.div<{ device: Device }>`
  font: ${({ theme, device }) =>
    theme.fonts.bodyLarge};

  h1,
  h2,
  h3 {
    margin: 24px 0 12px;
    font-weight: 700;
  }

  h1 {
    font-size: 1.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 16px;
    line-height: 1.7;
  }

  ul,
  ol {
    margin-bottom: 16px;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.7;
  }

  blockquote {
    margin: 16px 0;
    padding-left: 16px;
    border-left: 4px solid ${({ theme }) => theme.colors.dividers};

    color: ${({ theme }) => theme.colors.textSecondary};
    font-style: italic;
  }

  pre {
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 4px;

    background: ${({ theme }) => theme.colors.backgroundHover};

    overflow-x: auto;
  }

  code {
    padding: 2px 4px;
    border-radius: 2px;

    background: ${({ theme }) => theme.colors.backgroundHover};
    font-family: monospace;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    margin: 16px 0;
    border-radius: 8px;

    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  p[data-caption] {
    margin-bottom: 8px;

    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;
