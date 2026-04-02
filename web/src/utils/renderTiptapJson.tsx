import React from 'react';

interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
  text?: string;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

// allowlist 방식 — 허용된 프로토콜만 통과 (blocklist는 vbscript: 등 신규 프로토콜 대응 불가)
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url, 'https://placeholder.invalid');
    const allowed = ['https:', 'http:', 'mailto:'];
    if (allowed.includes(parsed.protocol)) return url;
  } catch {
    // 상대경로 허용 (/path, #hash)
    if (url.startsWith('/') || url.startsWith('#')) return url;
  }
  return '#';
};

const applyMarks = (
  content: React.ReactNode,
  marks: TiptapMark[],
  key: string,
): React.ReactNode => {
  return marks.reduce((acc, mark, i) => {
    const markKey = `${key}-m${i}`;
    switch (mark.type) {
      case 'bold':
        return <strong key={markKey}>{acc}</strong>;
      case 'italic':
        return <em key={markKey}>{acc}</em>;
      case 'underline':
        return <u key={markKey}>{acc}</u>;
      case 'code':
        return <code key={markKey}>{acc}</code>;
      case 'strike':
        return <s key={markKey}>{acc}</s>;
      case 'link': {
        const href = sanitizeUrl(String(mark.attrs?.href ?? '#'));
        return (
          <a
            key={markKey}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, content);
};

const renderNode = (node: TiptapNode, key: string): React.ReactNode => {
  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </p>
      );

    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 1), 1), 6);
      const content = node.content?.map((c, i) => renderNode(c, `${key}-${i}`));

      switch (level) {
        case 1:
          return <h1 key={key}>{content}</h1>;
        case 2:
          return <h2 key={key}>{content}</h2>;
        case 3:
          return <h3 key={key}>{content}</h3>;
        case 4:
          return <h4 key={key}>{content}</h4>;
        case 5:
          return <h5 key={key}>{content}</h5>;
        case 6:
          return <h6 key={key}>{content}</h6>;
        default:
          return <h1 key={key}>{content}</h1>;
      }
    }

    case 'bulletList':
      return (
        <ul key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </li>
      );

    case 'blockquote':
      return (
        <blockquote key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </blockquote>
      );

    case 'codeBlock':
      return (
        <pre key={key}>
          <code>
            {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
          </code>
        </pre>
      );

    case 'image': {
      const src = sanitizeUrl(String(node.attrs?.src ?? ''));
      const alt = String(node.attrs?.alt ?? '');
      return <img key={key} src={src} alt={alt} style={{ maxWidth: '100%' }} />;
    }

    case 'text': {
      const text = node.text ?? '';
      if (!node.marks?.length) {
        return text;
      }
      return applyMarks(text, node.marks, key) as React.ReactElement;
    }

    case 'caption':
      return (
        <p key={key} data-caption="">
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </p>
      );

    case 'hardBreak':
      return <br key={key} />;

    default:
      return null;
  }
};

export const renderTiptapJson = (doc: TiptapDoc): React.ReactNode => {
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;
  return doc.content.map((node, i) => renderNode(node, `n${i}`));
};
