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
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};

  h1,
  h2,
  h3 {
    margin: 1.5rem 0 0.75rem;
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
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.7;
  }

  blockquote {
    margin: 1rem 0;
    padding-left: 1rem;
    border-left: 0.25rem solid ${({ theme }) => theme.colors.dividers};

    color: ${({ theme }) => theme.colors.textSecondary};
    font-style: italic;
  }

  pre {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 0.25rem;

    background: ${({ theme }) => theme.colors.backgroundHover};

    overflow-x: auto;
  }

  code {
    padding: 0.125rem 0.25rem;
    border-radius: 0.125rem;

    background: ${({ theme }) => theme.colors.backgroundHover};
    font-family: monospace;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    margin: 1rem 0;
    border-radius: 0.5rem;

    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  p[data-caption] {
    margin-bottom: 0.5rem;

    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;
