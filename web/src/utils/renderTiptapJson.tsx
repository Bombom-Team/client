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

// javascript:, data: 프로토콜 차단
export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '#';
  }
  return url;
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
      case 'link': {
        const href = sanitizeUrl(String(mark.attrs?.href ?? '#'));
        return (
          <a key={markKey} href={href} target="_blank" rel="noopener noreferrer">
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
          <code>{node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}</code>
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
        return <React.Fragment key={key}>{text}</React.Fragment>;
      }
      return applyMarks(text, node.marks, key) as React.ReactElement;
    }

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
