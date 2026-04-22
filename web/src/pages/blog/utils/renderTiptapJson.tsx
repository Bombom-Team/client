import { createElement } from 'react';
import { validateUrl } from './url';
import type { TiptapDoc, TiptapMark, TiptapNode } from '../types/post';
import type { ReactNode } from 'react';

const renderChildren = (node: TiptapNode, key: string) => {
  return node.content?.map((childNode, index) =>
    renderNode(childNode, `${key}-${index}`),
  );
};

const convertMarks = (
  content: ReactNode,
  marks: TiptapMark[],
  key: string,
): ReactNode => {
  return marks.reduce((acc, mark, index) => {
    const markKey = `${key}-m${index}`;
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
      case 'highlight': {
        const color = mark.attrs?.color;
        return (
          <mark
            key={markKey}
            style={color ? { backgroundColor: String(color) } : undefined}
          >
            {acc}
          </mark>
        );
      }
      case 'link': {
        const href = validateUrl(String(mark.attrs?.href ?? '#'));
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

const renderNode = (node: TiptapNode, key: string): ReactNode => {
  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{renderChildren(node, key)}</p>;

    case 'heading': {
      const level = Math.min(Math.max(Number(node.attrs?.level ?? 1), 1), 6);
      const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return createElement(tag, { key }, renderChildren(node, key));
    }

    case 'bulletList':
      return <ul key={key}>{renderChildren(node, key)}</ul>;

    case 'orderedList':
      return <ol key={key}>{renderChildren(node, key)}</ol>;

    case 'listItem':
      return <li key={key}>{renderChildren(node, key)}</li>;

    case 'blockquote':
      return <blockquote key={key}>{renderChildren(node, key)}</blockquote>;

    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{renderChildren(node, key)}</code>
        </pre>
      );

    case 'image': {
      const src = validateUrl(String(node.attrs?.src ?? ''));
      const alt = String(node.attrs?.alt ?? '');
      const width = node.attrs?.width ? Number(node.attrs.width) : null;
      return (
        <img
          key={key}
          src={src}
          alt={alt}
          style={{
            width: width ? `${width}px` : '100%',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      );
    }

    case 'text': {
      const text = node.text ?? '';
      if (!node.marks?.length) return text;
      return convertMarks(text, node.marks, key);
    }

    case 'caption':
      return (
        <p key={key} data-caption="">
          {renderChildren(node, key)}
        </p>
      );

    case 'hardBreak':
      return <br key={key} />;

    case 'horizontalRule':
      return <hr key={key} />;

    default:
      return null;
  }
};

export const renderTiptapJson = (doc: TiptapDoc) => {
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) return null;
  return doc.content.map((node, index) => renderNode(node, `node${index}`));
};
