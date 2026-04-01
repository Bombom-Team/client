import React from 'react';
import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import { renderTiptapJson } from '@/utils/renderTiptapJson';
import type { TiptapDoc } from '@/utils/renderTiptapJson';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const device = useDevice();

  let renderedContent: React.ReactNode;
  try {
    const json = JSON.parse(content) as unknown;
    if (
      json &&
      typeof json === 'object' &&
      (json as TiptapDoc).type === 'doc'
    ) {
      renderedContent = renderTiptapJson(json as TiptapDoc);
    } else {
      renderedContent = <LegacyContent device={device}>{content}</LegacyContent>;
    }
  } catch {
    renderedContent = <LegacyContent device={device}>{content}</LegacyContent>;
  }

  return (
    <Container device={device}>
      <RichContent device={device}>{renderedContent}</RichContent>
    </Container>
  );
};

export default PostContent;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LegacyContent = styled.p<{ device: Device }>`
  margin-bottom: 16px;
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
`;

const RichContent = styled.div<{ device: Device }>`
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};

  h1,
  h2,
  h3 {
    font-weight: 700;
    margin: 24px 0 12px;
  }
  h1 {
    font-size: 28px;
  }
  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 20px;
  }

  p {
    margin-bottom: 16px;
    line-height: 1.7;
  }

  ul,
  ol {
    padding-left: 24px;
    margin-bottom: 16px;
  }
  li {
    margin-bottom: 8px;
    line-height: 1.7;
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.dividers};
    padding-left: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 16px 0;
    font-style: italic;
  }

  pre {
    background: ${({ theme }) => theme.colors.backgroundHover};
    border-radius: 4px;
    padding: 16px;
    overflow-x: auto;
    margin-bottom: 16px;
  }

  code {
    background: ${({ theme }) => theme.colors.backgroundHover};
    border-radius: 2px;
    padding: 2px 4px;
    font-family: monospace;
    font-size: 0.9em;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
    display: block;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }
`;
