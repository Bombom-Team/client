import styled from '@emotion/styled';
import { parseTiptapDoc } from '@/utils/tiptap/parseTiptapDoc';
import { renderTiptapJson } from '@/utils/tiptap/renderTiptapJson';

interface NoticeContentProps {
  content?: string;
}

// 블로그와 동일한 Tiptap JSON 렌더러 재사용 (@tiptap 런타임 불필요)
// 기존 평문 공지는 parseTiptapDoc이 throw → 평문으로 폴백(줄바꿈 보존)
const NoticeContent = ({ content }: NoticeContentProps) => {
  if (!content) return null;

  try {
    const rendered = renderTiptapJson(parseTiptapDoc(content));
    return <Content>{rendered}</Content>;
  } catch {
    return <PlainText>{content}</PlainText>;
  }
};

export default NoticeContent;

const PlainText = styled.p`
  width: 100%;
  white-space: pre-wrap;
`;

const Content = styled.div`
  width: 100%;

  font: ${({ theme }) => theme.fonts.t7Regular};
  line-height: 1.7;

  h1,
  h2,
  h3 {
    margin: 0;
    font-weight: 700;
  }

  h1 {
    margin-bottom: 12px;
    font-size: 1.75rem;
  }

  h2 {
    margin-bottom: 12px;
    font-size: 1.5rem;
  }

  h3 {
    margin-bottom: 12px;
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 12px;

    line-height: 1.7;
    white-space: normal;
  }

  p:empty {
    height: 1em;
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
    color: ${({ theme }) => theme.colors.primaryBomBom};
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
